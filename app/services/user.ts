import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { eq } from "drizzle-orm";

export type UserInfo = {
    id: string;
    githubUsername: string;
    email: string;
    teamId: string | null;
    teamName: string | null;
    teamRole: string | null;
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
            );

        if (searchedUser.length === 0) {
            return null;
        }

        return searchedUser[0];
    } catch (err) {
        console.error("Error retrieving user:", err);
        return null;
    }
}
