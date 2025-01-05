import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// TODO: Add authentication to only allow CORS requests from the frontend

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const searchedUser = await db
    .select({
      id: user.id,
      githubUsername: user.githubUsername,
      teamName: team.name,
      teamRole: teamMembers.role,
      numOfMembers: sql`count(*)`.mapWith(Number),
    })
    .from(user)
    .leftJoin(teamMembers, eq(teamMembers.userId, user.id))
    .leftJoin(team, eq(team.id, teamMembers.teamId))
    .where(eq(user.id, userId))
    .groupBy(user.id, user.githubUsername, team.name, teamMembers.role);

  if (searchedUser.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: "success",
    user: searchedUser[0],
  });
}
