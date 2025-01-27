import { db } from "@/utils/db";
import { preEventRegistrations } from "@/utils/db/schema/eventbrite";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { eq, sql } from "drizzle-orm";

export type UserInfo = {
  id: string;
  email: string;
  githubUsername: string;
  teamId: string | null;
  teamName: string | null;
  teamRole: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  preEventRegistered: boolean;
};

export async function getUserById(userId: string): Promise<UserInfo | null> {
  try {
    const searchedUser = await db
      .select({
        id: user.id,
        githubUsername: user.githubUsername,
        email: user.email,
        teamId: team.id,
        teamName: team.name,
        teamRole: teamMembers.role,
        role: user.role,
        createdAt: user.createdAt,
        preEventRegistered: sql<boolean>`EXISTS (
                    SELECT 1 FROM ${preEventRegistrations}
                    WHERE ${preEventRegistrations.email} = ${user.email}
                )`,
      })
      .from(user)
      .leftJoin(teamMembers, eq(teamMembers.userId, user.id))
      .leftJoin(team, eq(team.id, teamMembers.teamId))
      .where(eq(user.id, userId))
      .groupBy(
        user.id,
        user.githubUsername,
        user.email,
        team.name,
        teamMembers.role,
        team.id,
        user.role,
        user.createdAt,
      );

    if (searchedUser.length === 0) {
      return null;
    }

    const foundUser = searchedUser[0];
    return {
      ...foundUser,
      teamId: foundUser.teamId || null,
      teamName: foundUser.teamName || null,
      teamRole: foundUser.teamRole || null,
      role: foundUser.role || "participant",
      createdAt: foundUser.createdAt.toISOString(),
      updatedAt: foundUser.createdAt.toISOString(),
    };
  } catch (err) {
    console.error("Error retrieving user:", err);
    return null;
  }
}

export async function getAllUsers(): Promise<UserInfo[]> {
  const users = await db
    .select({
      id: user.id,
      email: user.email,
      githubUsername: user.githubUsername,
      role: user.role,
      createdAt: user.createdAt,
      teamId: teamMembers.teamId,
      teamName: team.name,
      teamRole: teamMembers.role,
      preEventRegistered: sql<boolean>`EXISTS (
                SELECT 1 FROM ${preEventRegistrations}
                WHERE ${preEventRegistrations.email} = ${user.email}
            )`,
    })
    .from(user)
    .leftJoin(teamMembers, eq(user.id, teamMembers.userId))
    .leftJoin(team, eq(teamMembers.teamId, team.id))
    .orderBy(user.createdAt);

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    githubUsername: user.githubUsername,
    teamId: user.teamId || null,
    teamName: user.teamName || null,
    teamRole: user.teamRole || null,
    role: user.role || "participant",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.createdAt.toISOString(),
    preEventRegistered: user.preEventRegistered,
  }));
}
