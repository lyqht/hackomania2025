import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("id");

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    const userTeam = await db
      .select()
      .from(teamMembers)
      .leftJoin(team, eq(team.id, teamMembers.teamId))
      .leftJoin(user, eq(user.id, teamMembers.userId))
      .where(eq(teamMembers.teamId, teamId));

    if (userTeam.length === 0) {
      return NextResponse.json({ error: "Team with ID not found" }, { status: 500 });
    }

    const formattedResponse = {
      id: userTeam[0].team!.id,
      name: userTeam[0].team!.name,
      createdAt: userTeam[0].team!.createdAt,
      leaderId: userTeam[0].team!.leaderId,
      users: userTeam.map((teamMember) => ({
        id: teamMember.user!.id,
        githubUsername: teamMember.user!.githubUsername,
        role: teamMember.team_members.role,
      })),
    };

    return NextResponse.json(formattedResponse);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
