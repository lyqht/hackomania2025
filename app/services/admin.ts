"use server";

import { syncPreEventRegistrations, uploadMainEventRegistrations } from "@/app/services/eventbrite";
import { db } from "@/utils/db";
import { mainEventRegistrations } from "@/utils/db/schema/eventbrite";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createUser as createUserInDb, CreateUserData, type UserUpdateData } from "./user";

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

export async function createUser(data: CreateUserData) {
  try {
    const newUser = await createUserInDb(data);
    if (!newUser) {
      return { error: "Failed to create user" };
    }
    return { data: newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "An error occurred while creating the user" };
  }
}

export async function markUserAsMainEventRegistered(userId: string) {
  try {
    // Get user info first
    const [userInfo] = await db
      .select({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        githubUsername: user.githubUsername,
      })
      .from(user)
      .where(eq(user.id, userId));

    if (!userInfo) {
      return { error: "User not found" };
    }

    // Check if user already exists in main event registrations
    const existingRegistration = await db
      .select({
        id: mainEventRegistrations.id,
        firstName: mainEventRegistrations.firstName,
        lastName: mainEventRegistrations.lastName,
        email: mainEventRegistrations.email,
        githubProfileUrl: mainEventRegistrations.githubProfileUrl,
        hasTeam: mainEventRegistrations.hasTeam,
      })
      .from(mainEventRegistrations)
      .where(eq(mainEventRegistrations.email, userInfo.email))
      .limit(1);

    if (existingRegistration.length > 0) {
      return {
        error: "Duplicate email found",
        duplicateData: {
          existingUser: existingRegistration[0],
          newUser: {
            firstName: userInfo.firstName || "",
            lastName: userInfo.lastName || "",
            email: userInfo.email,
            githubProfileUrl: `https://github.com/${userInfo.githubUsername}`,
            hasTeam: false,
          },
        },
      };
    }

    // Add to main event registrations
    await db.insert(mainEventRegistrations).values({
      firstName: userInfo.firstName || "",
      lastName: userInfo.lastName || "",
      email: userInfo.email,
      githubProfileUrl: `https://github.com/${userInfo.githubUsername}`,
      hasTeam: false,
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error marking user as registered:", error);
    return { error: "Failed to mark user as registered" };
  }
}

export async function mergeAndRegisterUser(
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    githubProfileUrl: string;
  },
) {
  try {
    await db.transaction(async (tx) => {
      // Delete existing registration with the same email
      await tx.delete(mainEventRegistrations).where(eq(mainEventRegistrations.email, data.email));

      // Add new registration
      await tx.insert(mainEventRegistrations).values({
        ...data,
        hasTeam: false,
      });

      // Update user info
      await tx
        .update(user)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          githubUsername: data.githubProfileUrl.split("/").pop() || "",
        })
        .where(eq(user.id, userId));
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error merging user:", error);
    return { error: "Failed to merge user" };
  }
}
