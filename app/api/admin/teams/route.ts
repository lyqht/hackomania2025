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

    // Get all registered emails in one query
    const registeredEmails = await db
      .select({ email: sql<string>`email` })
      .from(sql`main_event_registrations`);

    const registeredEmailSet = new Set(registeredEmails.map((r) => r.email));

    // Transform the response to match the expected format
    const transformedTeams = teams.map((team) => ({
      ...team,
      users: team.teamMembers.map((member) => ({
        ...member.user,
        teamRole: member.role,
        mainEventRegistered: registeredEmailSet.has(member.user.email),
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
