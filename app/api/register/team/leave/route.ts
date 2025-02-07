import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { teamId } = await request.json();
    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's current team role
    const { data: teamMember, error: teamMemberError } = await supabase
      .from("team_members")
      .select("role")
      .eq("userId", user.id)
      .eq("teamId", teamId)
      .single();

    if (teamMemberError) {
      return NextResponse.json({ error: "Failed to get team member information" }, { status: 500 });
    }

    if (!teamMember) {
      return NextResponse.json({ error: "User is not a member of this team" }, { status: 400 });
    }

    // If user is the leader and there are other members, they can't leave
    if (teamMember.role === "leader") {
      const { count, error: countError } = await supabase
        .from("team_members")
        .select("*", { count: "exact" })
        .eq("teamId", teamId);

      if (countError) {
        return NextResponse.json({ error: "Failed to check team members" }, { status: 500 });
      }

      if (count && count > 1) {
        return NextResponse.json(
          {
            error:
              "Team leaders cannot leave while other members are in the team. Transfer leadership first or remove other members.",
          },
          { status: 400 },
        );
      }
    }

    // Delete the team member record
    const { error: deleteError } = await supabase
      .from("team_members")
      .delete()
      .eq("userId", user.id)
      .eq("teamId", teamId);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to leave team" }, { status: 500 });
    }

    // If this was the last member, delete the team
    const { count, error: finalCountError } = await supabase
      .from("team_members")
      .select("*", { count: "exact" })
      .eq("teamId", teamId);

    if (!finalCountError && count === 0) {
      const { error: deleteTeamError } = await supabase.from("team").delete().eq("id", teamId);

      if (deleteTeamError) {
        console.error("Failed to delete empty team:", deleteTeamError);
      }
    }

    return NextResponse.json({
      message: "Successfully left team",
    });
  } catch (error) {
    console.error("Error leaving team:", error);
    return NextResponse.json({ error: "Failed to leave team" }, { status: 500 });
  }
}
