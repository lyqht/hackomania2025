import { NextResponse } from "next/server";
import {
  createChallenge,
  deleteChallenge,
  getAllChallenges,
  updateChallenge,
} from "@/app/services/challenge";

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
    const challenge = await request.json();
    const result = await createChallenge(challenge);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        {
          status: 400,
        },
      );
    }

    const result = await updateChallenge(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        {
          status: 400,
        },
      );
    }

    const result = await deleteChallenge(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting challenge:", error);
    return NextResponse.json(
      { error: "Failed to delete challenge" },
      {
        status: 500,
      },
    );
  }
}
