import { db } from "@/utils/db";
import { Challenge, challenges, NewChallenge } from "@/utils/db/schema/challenge";
import { eq } from "drizzle-orm";
import { team } from "@/utils/db/schema/team";

interface ChallengeMetadata {
  judges?: string[];
  teamQuota?: number;
  [key: string]: unknown;
}

export async function getAllChallenges() {
  return await db.query.challenges.findMany({
    with: {
      teams: true,
    },
  });
}

export async function getChallengeById(id: string) {
  return await db.query.challenges.findFirst({
    where: eq(challenges.id, id),
    with: {
      teams: true,
    },
  });
}

export async function createChallenge(challenge: NewChallenge) {
  const [newChallenge] = await db.insert(challenges).values(challenge).returning();
  return newChallenge;
}

export async function updateChallenge(id: string, challenge: Partial<Challenge>) {
  const [updatedChallenge] = await db
    .update(challenges)
    .set({ ...challenge, updatedAt: "NOW()" })
    .where(eq(challenges.id, id))
    .returning();
  return updatedChallenge;
}

export async function deleteChallenge(id: string) {
  const [deletedChallenge] = await db.delete(challenges).where(eq(challenges.id, id)).returning();
  return deletedChallenge;
}

export async function assignTeamToChallenge(teamId: string, challengeId: string) {
  const [updatedTeam] = await db
    .update(team)
    .set({ challengeId })
    .where(eq(team.id, teamId))
    .returning();
  return updatedTeam;
}

export async function removeTeamFromChallenge(teamId: string) {
  const [updatedTeam] = await db
    .update(team)
    .set({ challengeId: null })
    .where(eq(team.id, teamId))
    .returning();
  return updatedTeam;
}

export async function getTeamsByChallenge(challengeId: string) {
  return await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
    with: {
      teams: true,
    },
  });
}

export async function getChallengeStats() {
  const allChallenges = await db.query.challenges.findMany({
    with: {
      teams: true,
    },
  });

  return allChallenges.map((challenge) => ({
    id: challenge.id,
    name: challenge.name,
    teamCount: challenge.teams.length,
    teamQuota: (challenge.metadata as ChallengeMetadata)?.teamQuota || null,
  }));
}
