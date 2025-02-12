"use server";

import { db } from "@/utils/db";
import {
  mainEventRegistrations,
  preEventRegistrations,
} from "@/utils/db/schema/eventbrite";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export type UserInfo = {
  id: string;
  email: string;
  githubUsername: string;
  firstName: string | null;
  lastName: string | null;
  teamId: string | null;
  teamName: string | null;
  teamRole: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  preEventRegistered: boolean;
  mainEventRegistered: boolean;
};

export type UserUpdateData = Partial<UserInfo> & {
  newTeamName?: string;
};

export type CreateUserData = {
  email: string;
  githubUsername: string;
  firstName: string;
  lastName: string;
  role: "participant" | "admin";
};

export async function getAllUsersWithoutPagination(): Promise<UserInfo[]> {
  try {
    const users = await db
      .select({
        id: user.id,
        email: user.email,
        githubUsername: user.githubUsername,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
        teamId: teamMembers.teamId,
        teamName: team.name,
        teamRole: teamMembers.role,
        preEventRegistered: sql<boolean>`EXISTS (
                    SELECT 1 FROM ${preEventRegistrations}
                    WHERE ${preEventRegistrations.email} = ${user.email}
                )`,
        mainEventRegistered: sql<boolean>`EXISTS (
                    SELECT 1 FROM main_event_registrations
                    WHERE SUBSTRING(main_event_registrations.github_profile_url FROM 'github.com/([^/]+)') = ${user.githubUsername}
                )`,
      })
      .from(user)
      .leftJoin(teamMembers, eq(user.id, teamMembers.userId))
      .leftJoin(team, eq(teamMembers.teamId, team.id))
      .orderBy(desc(user.createdAt));

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      githubUsername: user.githubUsername,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      teamId: user.teamId || null,
      teamName: user.teamName || null,
      teamRole: user.teamRole || null,
      role: user.role || "participant",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.createdAt.toISOString(),
      preEventRegistered: user.preEventRegistered,
      mainEventRegistered: user.mainEventRegistered,
    }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

// #region Server Pagination - currently unused since we rely on client side pagination
export type PaginatedUsers = {
  data: UserInfo[];
  count: number;
};

const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? (page - 1) * limit : 0;
  const to = from + size - 1;

  return { from, to };
};

export async function getUserById(userId: string): Promise<UserInfo | null> {
  try {
    const searchedUser = await db
      .select({
        id: user.id,
        githubUsername: user.githubUsername,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        teamId: team.id,
        teamName: team.name,
        teamRole: teamMembers.role,
        role: user.role,
        createdAt: user.createdAt,
        preEventRegistered: sql<boolean>`EXISTS (
                    SELECT 1 FROM ${preEventRegistrations}
                    WHERE ${preEventRegistrations.email} = ${user.email}
                )`,
        mainEventRegistered: sql<boolean>`EXISTS (
                    SELECT 1 FROM main_event_registrations
                    WHERE SUBSTRING(main_event_registrations.github_profile_url FROM 'github.com/([^/]+)') = ${user.githubUsername}
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
        user.firstName,
        user.lastName,
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
      firstName: foundUser.firstName || null,
      lastName: foundUser.lastName || null,
      teamId: foundUser.teamId || null,
      teamName: foundUser.teamName || null,
      teamRole: foundUser.teamRole || null,
      role: foundUser.role || "participant",
      createdAt: foundUser.createdAt.toISOString(),
      updatedAt: foundUser.createdAt.toISOString(),
      preEventRegistered: foundUser.preEventRegistered,
      mainEventRegistered: foundUser.mainEventRegistered,
    };
  } catch (err) {
    console.error("Error retrieving user:", err);
    return null;
  }
}

export async function getAllUsers(page = 1, pageSize = 10): Promise<PaginatedUsers> {
  // First get total count
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(user);

  const totalCount = Number(countResult[0].count);

  // Get paginated results
  const { from } = getPagination(page, pageSize);
  const users = await db
    .select({
      id: user.id,
      email: user.email,
      githubUsername: user.githubUsername,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      teamId: teamMembers.teamId,
      teamName: team.name,
      teamRole: teamMembers.role,
      preEventRegistered: sql<boolean>`EXISTS (
                SELECT 1 FROM ${preEventRegistrations}
                WHERE ${preEventRegistrations.email} = ${user.email}
            )`,
      mainEventRegistered: sql<boolean>`EXISTS (
                SELECT 1 FROM main_event_registrations
                WHERE SUBSTRING(main_event_registrations.github_profile_url FROM 'github.com/([^/]+)') = ${user.githubUsername}
            )`,
    })
    .from(user)
    .leftJoin(teamMembers, eq(user.id, teamMembers.userId))
    .leftJoin(team, eq(teamMembers.teamId, team.id))
    .orderBy(user.createdAt)
    .limit(pageSize)
    .offset(from);

  return {
    data: users.map((user) => ({
      id: user.id,
      email: user.email,
      githubUsername: user.githubUsername,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      teamId: user.teamId || null,
      teamName: user.teamName || null,
      teamRole: user.teamRole || null,
      role: user.role || "participant",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.createdAt.toISOString(),
      preEventRegistered: user.preEventRegistered,
      mainEventRegistered: user.mainEventRegistered,
    })),
    count: totalCount,
  };
}

export async function changePage(formData: FormData) {
  const page = formData.get("page");
  if (!page || typeof page !== "string") {
    throw new Error("Invalid page");
  }

  const pageNumber = parseInt(page, 10);
  redirect(`/admin?page=${pageNumber}`);
}

export async function createUser(
  data: CreateUserData,
): Promise<UserInfo | null> {
  try {
    // Create user
    const [newUser] = await db
      .insert(user)
      .values({
        email: data.email,
        githubUsername: data.githubUsername,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      })
      .returning();

    // Add to main event registrations only if the user is a participant
    if (data.role === "participant") {
      await db.insert(mainEventRegistrations).values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        githubProfileUrl: `https://github.com/${data.githubUsername}`,
        hasTeam: false,
      });
    }

    // Return the created user with all the fields
    return {
      id: newUser.id,
      email: newUser.email,
      githubUsername: newUser.githubUsername,
      firstName: newUser.firstName || null,
      lastName: newUser.lastName || null,
      teamId: null,
      teamName: null,
      teamRole: null,
      role: newUser.role || "participant",
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.createdAt.toISOString(),
      preEventRegistered: false,
      mainEventRegistered: true,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// #endregion
