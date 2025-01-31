"use server";

import { syncPreEventRegistrations, uploadMainEventRegistrations } from "@/app/services/eventbrite";
import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type UserUpdateData } from "./user";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      throw new Error("No file provided");
    }

    await uploadMainEventRegistrations(file);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "Failed to upload file" };
  }
}

export async function syncEventbrite() {
  try {
    await syncPreEventRegistrations();
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error syncing registrations:", error);
    return { error: "Failed to sync registrations" };
  }
}

export async function setTeamLeader(userId: string) {
  try {
    // First get the user's team
    const userTeam = await db
      .select({
        teamId: teamMembers.teamId,
      })
      .from(teamMembers)
      .where(eq(teamMembers.userId, userId))
      .limit(1);

    if (!userTeam.length) {
      return { error: "User is not in a team" };
    }

    const teamId = userTeam[0].teamId;

    await db.transaction(async (tx) => {
      // First, demote any existing leader to member
      await tx
        .update(teamMembers)
        .set({ role: "member" })
        .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.role, "leader")));

      // Then set the new leader
      await tx
        .update(teamMembers)
        .set({ role: "leader" })
        .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));

      // Update the team's leaderId
      await tx.update(team).set({ leaderId: userId }).where(eq(team.id, teamId));
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error setting team leader:", error);
    return { error: "Failed to set team leader" };
  }
}

export async function removeUser(userId: string) {
  try {
    await db.transaction(async (tx) => {
      // Remove from team members first (if they're in a team)
      await tx.delete(teamMembers).where(eq(teamMembers.userId, userId));

      // Then remove the user
      await tx.delete(user).where(eq(user.id, userId));
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error removing user:", error);
    return { error: "Failed to remove user" };
  }
}

export async function getAvailableTeams() {
  try {
    // Get all teams with their member counts
    const teamsWithCounts = await db
      .select({
        id: team.id,
        name: team.name,
        memberCount: sql<number>`count(${teamMembers.userId})`,
      })
      .from(team)
      .leftJoin(teamMembers, eq(team.id, teamMembers.teamId))
      .groupBy(team.id, team.name)
      .orderBy(team.name);

    return teamsWithCounts;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

export async function editUser(userId: string, data: UserUpdateData) {
  try {
    const { email, githubUsername, teamName, newTeamName } = data;

    await db.transaction(async (tx) => {
      // Update user info
      await tx
        .update(user)
        .set({
          email,
          githubUsername,
        })
        .where(eq(user.id, userId));

      // Handle team changes
      if (newTeamName) {
        // Create new team
        const [newTeam] = await tx
          .insert(team)
          .values({
            name: newTeamName,
          })
          .returning();

        // Add user to new team
        await tx.insert(teamMembers).values({
          userId,
          teamId: newTeam.id,
          role: "member",
        });
      } else if (teamName) {
        // Get the target team
        const targetTeam = await tx.select().from(team).where(eq(team.name, teamName)).limit(1);

        if (targetTeam.length) {
          // Remove from current team if any
          await tx.delete(teamMembers).where(eq(teamMembers.userId, userId));

          // Add to new team
          await tx.insert(teamMembers).values({
            userId,
            teamId: targetTeam[0].id,
            role: "member",
          });
        }
      }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user" };
  }
}
