"use server";

import { db } from "@/utils/db";
import { preEventRegistrations } from "@/utils/db/schema/eventbrite";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

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

export async function getAllUsersWithoutPagination(): Promise<UserInfo[]> {
  try {
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
      .orderBy(desc(user.createdAt));

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
    .orderBy(user.createdAt)
    .limit(pageSize)
    .offset(from);

  return {
    data: users.map((user) => ({
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

// #endregion
