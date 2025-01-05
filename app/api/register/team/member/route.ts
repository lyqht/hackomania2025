import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const searchedUser = await db
    .select({
      userId: user.id,
      teamName: team.name,
      teamRole: teamMembers.role,
    })
    .from(user)
    .leftJoin(teamMembers, eq(user.id, teamMembers.userId))
    .leftJoin(team, eq(team.id, teamMembers.teamId))
    .where(eq(user.id, userId));

  if (searchedUser.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: "success",
    user: searchedUser[0],
  });
}

export async function DELETE(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("id");
    const deleteUserId = searchParams.get("userId");

    if (!teamId || !deleteUserId) {
      return NextResponse.json({ error: "Team ID and User ID are required" }, { status: 400 });
    }

    // Delete the user from the team
    await db.transaction(async (tx) => {
      const teamReference = await tx.select().from(team).where(eq(team.id, teamId));
      if (teamReference.length === 0) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
      if (teamReference[0].leaderId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (teamReference[0].leaderId === deleteUserId) {
        return NextResponse.json({ error: "Cannot remove the team leader" }, { status: 400 });
      }

      await tx.delete(teamMembers).where(eq(teamMembers.userId, deleteUserId));
    });

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}

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
    const { teamId, addUserUsernames } = await request.json();
    if (!teamId || !addUserUsernames) {
      return NextResponse.json(
        { error: "Team ID and Usernames to Add are required" },
        { status: 400 },
      );
    }

    // Add each user to the team
    await db.transaction(async (tx) => {
      const teamReference = await tx.select().from(team).where(eq(team.id, teamId));
      if (teamReference.length === 0) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
      if (teamReference[0].leaderId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      for (const username of addUserUsernames) {
        const userReference = await tx.select().from(user).where(eq(user.githubUsername, username));
        if (userReference.length === 0) {
          tx.rollback();
          return NextResponse.json(
            { error: `User with GitHub Username (${username}) not found` },
            { status: 404 },
          );
        }

        await tx.insert(teamMembers).values({
          teamId: teamId,
          userId: userReference[0].id,
          role: "member",
        });
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
