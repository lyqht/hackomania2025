import { db } from "@/utils/db";
import { team } from "@/utils/db/schema/team";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const { teamId } = await params;

    // Delete the team (team members will be automatically deleted due to ON DELETE CASCADE)
    const [deletedTeam] = await db.delete(team).where(eq(team.id, teamId))
      .returning();

    if (!deletedTeam) {
      return NextResponse.json(
        { error: "Team not found" },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(deletedTeam);
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      {
        status: 500,
      },
    );
  }
}
