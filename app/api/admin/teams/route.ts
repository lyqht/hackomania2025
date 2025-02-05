import { db } from "@/utils/db";
import { NextResponse } from "next/server";

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

    // Transform the response to match the expected format
    const transformedTeams = teams.map((team) => ({
      ...team,
      users: team.teamMembers.map((member) => ({
        ...member.user,
        teamRole: member.role,
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
