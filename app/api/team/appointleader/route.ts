import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");

    // Parse the request body
    const { userId } = await request.json();
    if (!userId || !teamId) {
      return NextResponse.json(
        { error: "Team ID and User ID to Appoint as Leader is required" },
        { status: 400 },
      );
    }

    await db.transaction(async (tx) => {
      await tx.update(team).set({ leaderId: userId }).where(eq(team.id, teamId));
      await tx.update(teamMembers).set({ role: "leader" }).where(eq(teamMembers.teamId, teamId));
    });

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
