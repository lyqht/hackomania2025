"use server";

import { getTeamById, updateTeam } from "@/app/services/team";
import { getUserFromSession } from "@/app/services/auth";
import { NextRequest, NextResponse } from "next/server";
import { TeamSubmission } from "@/utils/db/schema/team";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        },
      );
    }

    const { teamId } = await params;
    const team = await getTeamById(teamId);
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        {
          status: 404,
        },
      );
    }

    // Check if user is part of the team
    const isTeamMember = team.users.some((member) => member.id === user.id);
    if (!isTeamMember) {
      return NextResponse.json(
        { error: "You are not authorized to submit for this team" },
        { status: 403 },
      );
    }

    // Check if team has a challenge
    if (!team.challengeId) {
      return NextResponse.json(
        { error: "Team does not have a challenge selected" },
        { status: 400 },
      );
    }

    const submission: TeamSubmission = await request.json();

    // Update team with submission
    await updateTeam(team.id, {
      submission,
    });

    return NextResponse.json({
      message: "Submission updated successfully",
    });
  } catch (error) {
    console.error("Error updating team submission:", error);
    return NextResponse.json({ error: "Failed to update team submission" }, {
      status: 500,
    });
  }
}
