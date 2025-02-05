import { Team as DbTeam } from "@/utils/db/schema/team";
import { UserInfo } from "./user";
import { db } from "@/utils/db";
import { team, teamMembers } from "@/utils/db/schema/team";
import { eq } from "drizzle-orm";
import { getUserById } from "./user";

export interface Team extends Omit<DbTeam, "challengeId"> {
  users: UserInfo[];
  challengeId: string | null;
}

export async function getTeamById(teamId: string): Promise<Team | null> {
  try {
    const [firstTeam] = await db.select().from(team).where(eq(team.id, teamId)).limit(1);

    if (!firstTeam) {
      return null;
    }

    const members = await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));

    const userPromises = members.map(async (member) => {
      const user = await getUserById(member.userId);
      if (!user) throw new Error(`User ${member.userId} not found`);
      return {
        ...user,
        teamRole: member.role,
      };
    });

    const users = await Promise.all(userPromises);

    return {
      ...firstTeam,
      users,
    };
  } catch (err) {
    console.error("Error getting team:", err);
    return null;
  }
}
