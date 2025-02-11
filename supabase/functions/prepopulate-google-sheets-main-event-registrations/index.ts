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

function normalizeGithubUrl(url: string): string {
  if (!url || ["NA", "Nil", "N/A", "-", ""].includes(url.trim())) {
    return "";
  }

  const trimmedUrl = url.trim();

  // Extract username from URL, handling various formats
  const githubRegex =
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})(?:\/.*)?$/i;
  const match = trimmedUrl.match(githubRegex);
  if (match) {
    return `https://github.com/${match[1]}`;
  }

  // If it's just a username, construct the URL
  if (!trimmedUrl.includes("github.com")) {
    const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (usernameRegex.test(trimmedUrl)) {
      return `https://github.com/${trimmedUrl}`;
    }
  }

  return "";
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
  // First, filter out rows with missing data
  const validRows = rows.filter((row) => {
    const email = row["Email Address"];
    const githubUrl = normalizeGithubUrl(row["Your Github Profile Link"]);

    if (email == "" || githubUrl == "") {
      return false;
    }
    return true;
  });

  if (validRows.length === 0) {
    console.log("No rows to process for adding main event registrations");
    return 0;
  }

  console.log("Processing main event registrations for valid rows:", validRows.length);

  // Get all existing records at once
  const { data: allExistingRecords, error: fetchError } = await supabaseClient
    .from("main_event_registrations")
    .select("email, github_profile_url");

  if (fetchError) {
    console.error("Error fetching existing records:", fetchError);
    return 0;
  }

  // Create sets for quick lookup, normalizing GitHub URLs
  const existingEmails = new Set(allExistingRecords?.map((r) => r.email) || []);
  const existingGithubUrls = new Set(
    (allExistingRecords || [])
      .map((r) => normalizeGithubUrl(r.github_profile_url || ""))
      .filter((url) => url !== ""), // Remove empty URLs
  );

  // Filter out rows that already exist
  const newRows = validRows.filter((row) => {
    const email = row["Email Address"].trim().toLowerCase();
    const githubUrl = normalizeGithubUrl(row["Your Github Profile Link"]);
    if (existingEmails.has(email) || (githubUrl && existingGithubUrls.has(githubUrl))) {
      return false;
    }
    return true;
  });

  if (newRows.length === 0) {
    console.log("No new rows to insert for main event registrations");
    return 0;
  }

  const rowsToInsert = newRows.map((row) => {
    const normalizedUrl = normalizeGithubUrl(row["Your Github Profile Link"]);
    return {
      first_name: row["First Name"],
      last_name: row["Last Name"],
      email: row["Email Address"],
      github_profile_url: normalizedUrl,
      linkedin_profile_url: row["Your LinkedIn Profile Link"],
      has_team: row["Do you already have a team?"].toLowerCase() === "yes",
      team_name: row["What is your team name? (Also ask your team members to put the same name)"],
      ticket_email: row["Your Eventbrite Email"],
      approved_by: row["Approved By"],
    };
  });

  console.log("Main event registrations to insert:", rowsToInsert.length);

  const { data: insertedData, error: insertError } = await supabaseClient
    .from("main_event_registrations")
    .insert(rowsToInsert)
    .select();

  if (insertError) {
    console.error("Error during batch insert:", insertError);
    console.error("Attempted to insert:", rowsToInsert);
    return 0;
  }

  return insertedData?.length || 0;
}

async function createOrGetUsers(supabaseClient: SupabaseClient<Database>, rows: CSVRow[]) {
  // Create a map of unique users by email AND GitHub URL
  const uniqueUsers = new Map();
  rows.forEach((row) => {
    const githubUrl = normalizeGithubUrl(row["Your Github Profile Link"]);
    const email = (row["Email Address"] || row["Your Eventbrite Email"]).trim();
    if (githubUrl != "") {
      const githubUsername = (
        githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "") || ""
      ).toLowerCase();
      if (githubUsername != "") {
        uniqueUsers.set(githubUsername, {
          email,
          githubUsername,
          firstName: row["First Name"].trim(),
          lastName: row["Last Name"].trim(),
        });
      }
    }
  });

  // Get all existing users
  const { data: allExistingUsers, error: fetchError } = await supabaseClient
    .from("user")
    .select("id, email, githubUsername, firstName, lastName, role, createdAt");

  if (fetchError) {
    console.error("Error fetching existing users:", fetchError);
    return [];
  }

  console.log("Existing users count:", allExistingUsers?.length);

  // Create sets for quick lookup
  const existingEmails = new Set(allExistingUsers?.map((u) => u.email.toLowerCase()) || []);
  const existingGithubUsernames = new Set(
    (allExistingUsers || [])
      .map((u) => u.githubUsername.toLowerCase())
      .filter((username) => username !== ""),
  );

  // Create a map of existing users by GitHub username for easy lookup
  const existingUsersByUsername = new Map(
    (allExistingUsers || []).map((user) => [user.githubUsername.toLowerCase(), user]),
  );

  console.log("Existing emails:", Array.from(existingEmails));
  console.log("Existing GitHub usernames:", Array.from(existingGithubUsernames));

  // Filter out users that already exist by either email or GitHub username
  const newUsers = Array.from(uniqueUsers.values()).filter((user) => {
    const emailExists = existingEmails.has(user.email);
    const usernameExists = existingGithubUsernames.has(user.githubUsername);

    if (emailExists || usernameExists) {
      return false;
    }
    return true;
  });

  console.log("New users to create:", newUsers.length);

  // Create new users
  let userData: User[] = [];
  if (newUsers.length > 0) {
    const { data, error: userError } = await supabaseClient.from("user").insert(newUsers).select();

    if (userError) {
      console.error("Error creating users:", userError);
      console.error("Attempted to insert:", newUsers);
      return allExistingUsers || [];
    }
    userData = data || [];
  }

  // Update existing users
  const updatePromises = Array.from(uniqueUsers.values())
    .filter((user) => {
      const existingUser = existingUsersByUsername.get(user.githubUsername);
      return existingUser && (!existingUser.firstName || !existingUser.lastName);
    })
    .map(async (user) => {
      console.log(`Updating user ${user.githubUsername} with names:`, {
        firstName: user.firstName,
        lastName: user.lastName,
      });
      const { error: updateError } = await supabaseClient
        .from("user")
        .update({
          firstName: user.firstName,
          lastName: user.lastName,
        })
        .eq("githubUsername", user.githubUsername);

      if (updateError) {
        console.error(`Github user ${user.githubUsername} did not update:`, updateError);
      }
    });

  await Promise.all(updatePromises);
  return [...(allExistingUsers || []), ...userData];
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
        (u) => u.email === (row["Email Address"] || row["Your Eventb"]).trim(),
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

const deduplicateRows = (rows: CSVRow[]) => {
  const uniqueRows = rows.reduce((acc, row) => {
    const email = row["Email Address"];
    const githubUrl = normalizeGithubUrl(row["Your Github Profile Link"]);
    const key = `${email}_${githubUrl}`;
    if (!acc.has(key)) {
      acc.set(key, row);
    }
    return acc;
  }, new Map<string, CSVRow>());
  return Array.from(uniqueRows.values());
};

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
    let rows = parse(csvText, {
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

    rows = deduplicateRows(rows);

    const nonApprovedValues = ["Need help considering", "Reject", ""];
    const approvedRows = rows.filter((row) => !nonApprovedValues.includes(row["Approved By"]));

    const stats: ProcessingStats = {
      registrations: 0,
      users: 0,
      teams: 0,
      teamMembers: 0,
    };

    // Process registrations first
    stats.registrations = await createMainEventRegistrations(supabaseClient, approvedRows);

    // Process users independently - errors here won't affect registration creation
    try {
      const users = await createOrGetUsers(supabaseClient, approvedRows);
      stats.users = users.length;

      // Only process teams if user creation/fetching was successful
      const rowsWithTeams = approvedRows.filter(
        (row) =>
          row["Do you already have a team?"].toLowerCase() === "yes" &&
          row["What is your team name? (Also ask your team members to put the same name)"],
      );

      if (rowsWithTeams.length > 0) {
        try {
          const teams = await createOrGetTeams(supabaseClient, rowsWithTeams);
          stats.teams = teams.length;

          try {
            stats.teamMembers = await createTeamMembers(
              supabaseClient,
              rowsWithTeams,
              users,
              teams,
            );
          } catch (error) {
            console.error("Error creating team members:", error);
          }
        } catch (error) {
          console.error("Error processing teams:", error);
        }
      }
    } catch (error) {
      console.error("Error processing users:", error);
    }

    return new Response(
      JSON.stringify({
        message: `Successfully read ${rows.length} rows and processed ${stats.registrations} registrations`,
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
