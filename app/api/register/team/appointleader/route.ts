import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { createClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
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

    await db.transaction(async (tx) => {
      await tx.update(team).set({ leaderId: user.id }).where(eq(team.id, teamId));
      await tx.update(teamMembers).set({ role: "leader" }).where(eq(teamMembers.teamId, teamId));
    });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500 });
  }
}
