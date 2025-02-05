import {
  assignTeamToChallenge,
  getAllChallenges,
  removeTeamFromChallenge,
} from "@/app/services/challenge";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const challenges = await getAllChallenges();
    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { teamId, challengeId } = await request.json();
    if (!teamId || !challengeId) {
      return NextResponse.json({ error: "Team ID and Challenge ID are required" }, { status: 400 });
    }

    const result = await assignTeamToChallenge(teamId, challengeId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error assigning team to challenge:", error);
    return NextResponse.json({ error: "Failed to assign team to challenge" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { teamId } = await request.json();
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        {
          status: 400,
        },
      );
    }

    const result = await removeTeamFromChallenge(teamId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error removing team from challenge:", error);
    return NextResponse.json({ error: "Failed to remove team from challenge" }, { status: 500 });
  }
}
