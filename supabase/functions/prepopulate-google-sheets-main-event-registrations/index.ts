import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.48.0";
import { parse } from "jsr:@std/csv";
import type { Database } from "../../../types/database.types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CSVRow extends Record<string, string> {
  Timestamp: string;
  "Email Address": string;
  "First Name": string;
  "Last Name": string;
  "Your Github Profile Link": string;
  "Your LinkedIn Profile Link": string;
  "Do you already have a team?": string;
  "What is your team name? (Also ask your team members to put the same name)":
    string;
  "Your Eventbrite Email": string;
  "Please join the waitlist on the eventbrite page also": string;
  "Approved By": string;
  Remarks: string;
}

function extractGithubUsername(githubUrl: string): string {
  const usernameMatch = githubUrl.match(/github.com[/]([^/\s]+)/);
  return usernameMatch ? usernameMatch[1] : "";
}

interface ProcessingStats {
  registrations: number;
  users: number;
  teams: number;
  teamMembers: number;
}

async function createMainEventRegistrations(
  supabaseClient: SupabaseClient<Database>,
  rows: CSVRow[],
) {
  const { data, error: regError } = await supabaseClient
    .from("main_event_registrations")
    .upsert(
      rows.map((row) => ({
        first_name: row["First Name"],
        last_name: row["Last Name"],
        email: row["Email Address"],
        github_profile_url: row["Your Github Profile Link"],
        linkedin_profile_url: row["Your LinkedIn Profile Link"],
        has_team: row["Do you already have a team?"].toLowerCase() === "yes",
        team_name: row[
          "What is your team name? (Also ask your team members to put the same name)"
        ],
        ticket_email: row["Your Eventbrite Email"],
        approved_by: row["Approved By"],
      })),
      { onConflict: "email" },
    )
    .select();

  if (regError) {
    console.error("Error creating registrations:", regError);
    return 0;
  }
  return data?.length ?? 0;
}

async function createOrGetUsers(
  supabaseClient: SupabaseClient<Database>,
  rows: CSVRow[],
) {
  const { data: userData, error: userError } = await supabaseClient
    .from("user")
    .upsert(
      rows.map((row) => ({
        email: row["Email Address"].trim() ||
          row["Email to send ticket to"].trim(),
        githubUsername: extractGithubUsername(row["Your Github Profile Link"]),
      })),
      { onConflict: "email" },
    )
    .select();

  if (userError || !userData) {
    console.error("Error creating users:", userError);
    return [];
  }
  return userData;
}

async function createOrGetTeams(
  supabaseClient: SupabaseClient<Database>,
  rows: CSVRow[],
) {
  // Get unique team names
  const teamNames = [
    ...new Set(
      rows
        .filter((row) =>
          row["Do you already have a team?"].toLowerCase() === "yes"
        )
        .map(
          (row) =>
            row[
              "What is your team name? (Also ask your team members to put the same name)"
            ],
        )
        .filter(Boolean),
    ),
  ];

  const { data: teamData, error: teamError } = await supabaseClient
    .from("team")
    .upsert(
      teamNames.map((name) => ({ name })),
      { onConflict: "name" },
    )
    .select();

  if (teamError || !teamData) {
    console.error("Error creating teams:", teamError);
    return [];
  }
  return teamData;
}

async function createTeamMembers(
  supabaseClient: SupabaseClient<Database>,
  teamMemberships: { teamId: string; userId: string }[],
) {
  const { data, error: memberError } = await supabaseClient
    .from("team_members")
    .upsert(
      teamMemberships.map(({ teamId, userId }) => ({
        teamId,
        userId,
        role: "member",
      })),
      { onConflict: "teamId,userId" },
    )
    .select();

  if (memberError || !data) {
    console.error("Error creating team members:", memberError);
    return 0;
  }
  return data.length;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error:
          "This endpoint only accepts POST requests with form data containing a CSV file",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405, // Method Not Allowed
      },
    );
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      },
    );

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      throw new Error("No file uploaded");
    }

    if (!file.name.endsWith(".csv")) {
      throw new Error("Only CSV files are allowed");
    }

    if (
      file.type && !["text/csv", "application/vnd.ms-excel"].includes(file.type)
    ) {
      throw new Error("Invalid file type. Please upload a CSV file");
    }

    const csvText = await file.text();
    const rows = parse(csvText, {
      skipFirstRow: true,
      columns: [
        "Timestamp",
        "Email Address",
        "First Name",
        "Last Name",
        "Your Github Profile Link",
        "Your LinkedIn Profile Link",
        "Do you already have a team?",
        "What is your team name? (Also ask your team members to put the same name)",
        "Your Eventbrite Email",
        "Please join the waitlist on the eventbrite page also",
        "Approved By",
        "Remarks",
      ],
    }) as CSVRow[];

    const nonApprovedValues = ["Need help considering", "Reject", ""];
    const approvedRows = rows.filter(
      (row) => !nonApprovedValues.includes(row["Approved By"]),
    );

    const stats: ProcessingStats = {
      registrations: 0,
      users: 0,
      teams: 0,
      teamMembers: 0,
    };

    // Bulk create registrations
    stats.registrations = await createMainEventRegistrations(
      supabaseClient,
      approvedRows,
    );

    // Get rows with teams
    const rowsWithTeams = approvedRows.filter(
      (row) =>
        row["Do you already have a team?"].toLowerCase() === "yes" &&
        row[
          "What is your team name? (Also ask your team members to put the same name)"
        ],
    );

    if (rowsWithTeams.length > 0) {
      // Bulk create/get users
      const users = await createOrGetUsers(supabaseClient, rowsWithTeams);
      stats.users = users.length;

      // Bulk create/get teams
      const teams = await createOrGetTeams(supabaseClient, rowsWithTeams);
      stats.teams = teams.length;

      // Create team memberships
      const teamMemberships = rowsWithTeams
        .map((row) => {
          const user = users.find(
            (u) =>
              u.email ===
                (row["Email Address"] || row["Email to send ticket to"]),
          );
          const team = teams.find(
            (t) =>
              t.name ===
                row[
                  "What is your team name? (Also ask your team members to put the same name)"
                ],
          );
          return user && team ? { teamId: team.id, userId: user.id } : null;
        })
        .filter(
          (membership): membership is { teamId: string; userId: string } =>
            membership !== null,
        );

      stats.teamMembers = await createTeamMembers(
        supabaseClient,
        teamMemberships,
      );
    }

    return new Response(
      JSON.stringify({
        message: "Successfully processed registrations",
        stats: {
          registrationsCreated: stats.registrations,
          usersCreated: stats.users,
          teamsCreated: stats.teams,
          teamMembersCreated: stats.teamMembers,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
