import { Team as DbTeam } from "@/utils/db/schema/team";
import { UserInfo } from "./user";
import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { eq, sql } from "drizzle-orm";

export interface Team extends Omit<DbTeam, "challengeId"> {
  users: UserInfo[];
  challengeId: string | null;
}

export async function getTeamById(teamId: string): Promise<Team | null> {
  try {
    // Get team and all its members in a single query
    const result = await db
      .select({
        team: team,
        users: {
          id: user.id,
          email: user.email,
          githubUsername: user.githubUsername,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
          teamRole: teamMembers.role,
          preEventRegistered: sql<boolean>`EXISTS (
            SELECT 1 FROM pre_event_registrations
            WHERE pre_event_registrations.email = ${user.email}
          )`,
          mainEventRegistered: sql<boolean>`EXISTS (
            SELECT 1 FROM main_event_registrations
            WHERE main_event_registrations.email = ${user.email}
          )`,
        },
      })
      .from(team)
      .leftJoin(teamMembers, eq(teamMembers.teamId, team.id))
      .leftJoin(user, eq(user.id, teamMembers.userId))
      .where(eq(team.id, teamId));

    if (result.length === 0) {
      return null;
    }

    // Filter out any null users and map to the correct type
    const users: UserInfo[] = result
      .filter((row) => row.users.id !== null)
      .map((row) => ({
        id: row.users.id!,
        email: row.users.email || "",
        githubUsername: row.users.githubUsername || "",
        firstName: row.users.firstName || null,
        lastName: row.users.lastName || null,
        teamId: teamId,
        teamName: result[0].team.name,
        teamRole: row.users.teamRole || null,
        role: row.users.role || "participant",
        createdAt: row.users.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: row.users.createdAt?.toISOString() || new Date().toISOString(),
        preEventRegistered: row.users.preEventRegistered,
        mainEventRegistered: row.users.mainEventRegistered,
      }));

    return {
      ...result[0].team,
      users,
    };
  } catch (err) {
    console.error("Error getting team:", err);
    return null;
  }
}

export async function updateTeam(teamId: string, data: Partial<Team>) {
  try {
    const [updatedTeam] = await db
      .update(team)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(team.id, teamId))
      .returning();

    return updatedTeam;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
}
