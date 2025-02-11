import { db } from "@/utils/db";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get all teams with their members and challenge info
    const teams = await db.query.team.findMany({
      with: {
        challenge: true,
        teamMembers: {
          with: {
            user: true,
          },
        },
        leader: true,
      },
    });

    // Get all registered github usernames in one query
    const registeredGithubUsernames = await db
      .select({
        githubUsername: sql<string>`SUBSTRING(github_profile_url FROM 'github.com/([^/]+)')`,
      })
      .from(sql`main_event_registrations`);

    const registeredGithubUsernameSet = new Set(
      registeredGithubUsernames.map((r) => r.githubUsername),
    );

    // Transform the response to match the expected format
    const transformedTeams = teams.map((team) => ({
      ...team,
      users: team.teamMembers.map((member) => ({
        ...member.user,
        teamRole: member.role,
        mainEventRegistered: registeredGithubUsernameSet.has(member.user.githubUsername),
      })),
    }));

    return NextResponse.json(transformedTeams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      {
        status: 500,
      },
    );
  }
}
