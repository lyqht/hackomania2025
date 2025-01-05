import { createClient } from "@/utils/supabase/server";
import { db } from "@/utils/db";
import { NextResponse } from "next/server";
import { user } from "@/utils/db/schema/user";
import { eq } from "drizzle-orm";
import { team, teamMembers } from "@/utils/db/schema/team";

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Fetch the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const { teamId, insertUsername } = await request.json();
    if (!teamId || !insertUsername) {
      return NextResponse.json(
        { error: "Team ID and User's GitHub Username are required" },
        { status: 400 },
      );
    }

    // Insert the user into the team
    await db.transaction(async (tx) => {
      const userReference = await tx
        .select()
        .from(user)
        .where(eq(user.githubUsername, insertUsername));
      if (userReference.length === 0) {
        return NextResponse.json(
          { error: `User with GitHub Username (${insertUsername}) not found` },
          { status: 404 },
        );
      }
      if (userReference[0].id === session.user.id) {
        return NextResponse.json({ error: "Cannot add yourself to the team" }, { status: 400 });
      }
      const teamReference = await tx.select().from(team).where(eq(team.id, teamId));
      if (teamReference.length === 0) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }

      await tx.insert(teamMembers).values({
        teamId: teamId,
        userId: userReference[0].id,
        role: "member",
      });
    });

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
