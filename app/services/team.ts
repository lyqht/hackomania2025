import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { user } from "@/utils/db/schema/user";
import { eq } from "drizzle-orm";

export type Team = {
    id: string;
    name: string;
    createdAt: Date;
    leaderId: string;
    users: {
        id: string;
        githubUsername: string;
        role: string;
    }[];
};

export async function getTeamById(teamId: string): Promise<Team | null> {
    try {
        const userTeam = await db
            .select()
            .from(teamMembers)
            .leftJoin(team, eq(team.id, teamMembers.teamId))
            .leftJoin(user, eq(user.id, teamMembers.userId))
            .where(eq(teamMembers.teamId, teamId));

        if (userTeam.length === 0) {
            return null;
        }

        const firstTeam = userTeam[0].team!;

        return {
            id: firstTeam.id,
            name: firstTeam.name,
            createdAt: firstTeam.createdAt,
            leaderId: firstTeam.leaderId as string,
            users: userTeam.map((teamMember) => ({
                id: teamMember.user!.id,
                githubUsername: teamMember.user!.githubUsername,
                role: teamMember.team_members.role,
            })),
        };
    } catch (err) {
        console.error(err);
        return null;
    }
}
