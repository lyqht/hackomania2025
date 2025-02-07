import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        },
      );
    }

    // Check if user is already in a team
    const { data: existingTeamMember, error: existingTeamError } = await supabase
      .from("team_members")
      .select("*")
      .eq("userId", user.id)
      .single();

    if (existingTeamError && existingTeamError.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is what we want
      return NextResponse.json(
        {
          error: "Failed to check existing team membership",
        },
        { status: 500 },
      );
    }

    if (existingTeamMember) {
      return NextResponse.json(
        { error: "You are already in a team" },
        {
          status: 400,
        },
      );
    }

    // Check if the team exists and has space
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from("team_members")
      .select("*", { count: "exact" })
      .eq("teamId", teamId);

    if (teamMembersError) {
      return NextResponse.json({ error: "Failed to check team members" }, { status: 500 });
    }

    if (!teamMembers || teamMembers.length === 0) {
      return NextResponse.json(
        { error: "Team not found" },
        {
          status: 404,
        },
      );
    }

    if (teamMembers.length >= 5) {
      return NextResponse.json(
        { error: "Team is full" },
        {
          status: 400,
        },
      );
    }

    // Add user to the team
    const { error: joinError } = await supabase.from("team_members").insert({
      teamId,
      userId: user.id,
      role: "member",
    });

    if (joinError) {
      return NextResponse.json(
        { error: "Failed to join team" },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      message: "Successfully joined team",
    });
  } catch (error) {
    console.error("Error joining team:", error);
    return NextResponse.json(
      { error: "Failed to join team" },
      {
        status: 500,
      },
    );
  }
}
