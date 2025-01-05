import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const supabase = createClient();

    // Fetch the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve the user's team
    const userTeamReference = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, session.user.id));
    if (userTeamReference.length === 0) {
      return NextResponse.json({ error: "User is not part of a team" }, { status: 404 });
    }
    const userTeamId = userTeamReference[0].teamId;

    const userTeam = await db
      .select()
      .from(teamMembers)
      .leftJoin(team, eq(team.id, teamMembers.teamId))
      .leftJoin(user, eq(user.id, teamMembers.userId))
      .where(eq(teamMembers.teamId, userTeamId));

    if (userTeam.length === 0) {
      return NextResponse.json({ error: "Team with ID not found" }, { status: 500 });
    }

    return NextResponse.json({
      status: "success",
      team: userTeam[0],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(request: Request) {
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
    const { selectedTeamID, teamName } = await request.json();
    if (!selectedTeamID || !teamName) {
      return NextResponse.json(
        { error: "selectedTeamID and teamName is required" },
        { status: 400 },
      );
    }

    // Retrieve the team with the selectedTeamID
    const requestedTeam = await db.select().from(team).where(eq(team.id, selectedTeamID));
    if (requestedTeam.length === 0) {
      return NextResponse.json({ error: "Team with ID not found" }, { status: 404 });
    }

    // Ensure that only the leader can update the team name
    if (requestedTeam[0].leaderId !== session.user.id) {
      return NextResponse.json({ error: "User is not the team leader" }, { status: 403 });
    }

    // Add the user to the team
    await db.update(team).set({ name: teamName }).where(eq(team.id, selectedTeamID));

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
    const { teamName } = await request.json();
    // Create the Team
    const insertTeamRequest = await db
      .insert(team)
      .values({
        name: teamName,
        leaderId: session.user.id,
      })
      .returning();

    // Add the Team Leader to the Team
    await db.insert(teamMembers).values({
      teamId: insertTeamRequest[0].id,
      userId: session.user.id,
      role: "leader",
    });

    return NextResponse.json(
      {
        status: "success",
        team: insertTeamRequest[0],
      },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: Request) {
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
    const { selectedTeamID } = await request.json();
    if (!selectedTeamID) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    // Create a Transaction to validate that the user is the leader and has permission to delete the team, then delete
    await db.transaction(async (tx) => {
      const requestedTeam = await tx.select().from(team).where(eq(team.id, selectedTeamID));

      // Perform Validation
      if (requestedTeam.length === 0) {
        return NextResponse.json({ error: "Team with ID not found" }, { status: 404 });
      }

      if (requestedTeam[0].leaderId !== session.user.id) {
        return NextResponse.json({ error: "User is not the team leader" }, { status: 403 });
      }

      // Delete the team
      await tx.delete(team).where(eq(team.id, selectedTeamID));
    });

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
