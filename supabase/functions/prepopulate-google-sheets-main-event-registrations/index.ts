import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import { parse } from "jsr:@std/csv";
import type { Database } from "../../../types/database.types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CSVRow extends Record<string, string> {
  Timestamp: string;
  "Email Address": string;
  "First Name": string;
  "Last Name": string;
  "Your Github Profile Link": string;
  "Your LinkedIn Profile Link": string;
  "Do you already have a team?": string;
  "What is your team name? (Also ask your team members to put the same name)": string;
  "Your Eventbrite Email": string;
  "Please join the waitlist on the eventbrite page also": string;
  "Approved By": string;
  Remarks: string;
}

function extractGithubUsername(githubUrl: string): string {
  if (!githubUrl || ["NA", "Nil", "N/A", "-", ""].includes(githubUrl.trim())) {
    return "";
  }

  // If it's already just a username without URL
  if (!githubUrl.includes("github.com")) {
    return githubUrl.trim();
  }

  // Extract from full URL
  const usernameMatch = githubUrl.match(/github.com[/]([^/\s]+)/);
  return usernameMatch ? usernameMatch[1] : "";
}

interface ProcessingStats {
  registrations: number;
  users: number;
  teams: number;
  teamMembers: number;
}

interface User {
  id: string;
  email: string;
  githubUsername: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  createdAt: string;
}

interface Team {
  id: string;
  name: string;
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
        github_profile_url: (() => {
          const url = row["Your Github Profile Link"];
          if (!url || ["NA", "Nil", "N/A", "-", ""].includes(url.trim())) {
            return "";
          }
          // If it's already a valid GitHub URL, use it as is
          const githubRegex =
            /^https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
          if (githubRegex.test(url)) {
            return url;
          }
          // If it's just a username, construct the URL
          return `https://github.com/${url.trim()}`;
        })(),
        linkedin_profile_url: row["Your LinkedIn Profile Link"],
        has_team: row["Do you already have a team?"].toLowerCase() === "yes",
        team_name: row["What is your team name? (Also ask your team members to put the same name)"],
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

async function createOrGetUsers(supabaseClient: SupabaseClient<Database>, rows: CSVRow[]) {
  // Create a map of unique users by GitHub username
  const uniqueUsers = new Map();
  rows.forEach((row) => {
    const githubUsername = extractGithubUsername(row["Your Github Profile Link"]);
    if (githubUsername) {
      uniqueUsers.set(githubUsername, {
        email: row["Email Address"].trim() || row["Email to send ticket to"].trim(),
        githubUsername,
        firstName: row["First Name"].trim(),
        lastName: row["Last Name"].trim(),
      });
    }
  });

  // First, upsert unique users
  const { data: userData, error: userError } = await supabaseClient
    .from("user")
    .upsert(Array.from(uniqueUsers.values()), {
      onConflict: "githubUsername",
    })
    .select();

  if (userError || !userData) {
    console.error("Error creating users:", userError);
    return [];
  }

  // Then, update first and last names for existing users where these fields are null
  const updatePromises = Array.from(uniqueUsers.values()).map(async (user) => {
    const { error: updateError } = await supabaseClient
      .from("user")
      .update({
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .eq("githubUsername", user.githubUsername)
      .is("firstName", null);

    if (updateError) {
      console.error(`Error updating user ${user.githubUsername}:`, updateError);
    }
  });

  await Promise.all(updatePromises);
  return userData;
}

async function createOrGetTeams(supabaseClient: SupabaseClient<Database>, rows: CSVRow[]) {
  // Get unique team names, filtering out empty or whitespace-only names
  // Normalize team names by trimming and converting to lowercase for comparison
  const teamNames = [
    ...new Set(
      rows
        .filter((row) => row["Do you already have a team?"].toLowerCase() === "yes")
        .map((row) =>
          row["What is your team name? (Also ask your team members to put the same name)"]?.trim(),
        )
        .filter((name) => name && name.length > 0),
    ),
  ];

  // First try to get existing teams using case-insensitive search
  const { data: existingTeams, error: fetchError } = await supabaseClient
    .from("team")
    .select()
    .in("name", teamNames)
    .or(teamNames.map((name) => `name.ilike.${name}`).join(","));

  if (fetchError) {
    console.error("Error fetching existing teams:", fetchError);
    return [];
  }

  // Find team names that don't exist yet (case-insensitive comparison)
  const existingTeamNamesLower = new Set(
    (existingTeams || []).map((team) => team.name.toLowerCase()),
  );
  const newTeamNames = teamNames.filter((name) => !existingTeamNamesLower.has(name.toLowerCase()));

  // Create only the new teams
  if (newTeamNames.length > 0) {
    const { data: newTeams, error: createError } = await supabaseClient
      .from("team")
      .upsert(
        newTeamNames.map((name) => ({ name: name.trim() })),
        { onConflict: "name" },
      )
      .select();

    if (createError || !newTeams) {
      console.error("Error creating new teams:", createError);
      return existingTeams || [];
    }

    // Return both existing and new teams
    return [...(existingTeams || []), ...newTeams];
  }

  // If no new teams to create, return existing teams
  return existingTeams || [];
}

async function createTeamMembers(
  supabaseClient: SupabaseClient<Database>,
  rowsWithTeams: CSVRow[],
  users: User[],
  teams: Team[],
) {
  // Create a map of team names (lowercase) to team IDs for easier lookup
  const teamNameToId = new Map(teams.map((team) => [team.name.toLowerCase(), team.id]));

  // Create team memberships
  const teamMemberships = rowsWithTeams
    .map((row) => {
      const user = users.find(
        (u) => u.email === (row["Email Address"] || row["Email to send ticket to"]).trim(),
      );

      const teamName =
        row["What is your team name? (Also ask your team members to put the same name)"]?.trim();

      if (!teamName) return null;

      const teamId = teamNameToId.get(teamName.toLowerCase());

      return user && teamId ? { teamId, userId: user.id } : null;
    })
    .filter((membership): membership is { teamId: string; userId: string } => membership !== null);

  if (teamMemberships.length === 0) {
    return 0;
  }

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
        error: "This endpoint only accepts POST requests with form data containing a CSV file",
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

    if (file.type && !["text/csv", "application/vnd.ms-excel"].includes(file.type)) {
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
    const approvedRows = rows.filter((row) => !nonApprovedValues.includes(row["Approved By"]));

    const stats: ProcessingStats = {
      registrations: 0,
      users: 0,
      teams: 0,
      teamMembers: 0,
    };

    // Bulk create registrations
    stats.registrations = await createMainEventRegistrations(supabaseClient, approvedRows);

    // Process all approved users first
    const users = await createOrGetUsers(supabaseClient, approvedRows);
    stats.users = users.length;

    // Get rows with teams
    const rowsWithTeams = approvedRows.filter(
      (row) =>
        row["Do you already have a team?"].toLowerCase() === "yes" &&
        row["What is your team name? (Also ask your team members to put the same name)"],
    );

    if (rowsWithTeams.length > 0) {
      // Bulk create/get teams
      const teams = await createOrGetTeams(supabaseClient, rowsWithTeams);
      stats.teams = teams.length;

      // Create team memberships with the updated function signature
      stats.teamMembers = await createTeamMembers(supabaseClient, rowsWithTeams, users, teams);
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
