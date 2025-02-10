import { pgTable } from "drizzle-orm/pg-core";
import { check, json, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { challenges } from "./challenge";

export type TeamSubmission = {
  projectDescription?: string;
  slidesUrl?: string;
  repoUrl?: string;
};

export const team = pgTable("team", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  leaderId: uuid().references(() => user.id, { onUpdate: "cascade", onDelete: "cascade" }),
  challengeId: uuid().references(() => challenges.id),
  submission: json("submission").$type<TeamSubmission>(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    teamId: uuid()
      .references(() => team.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    userId: uuid()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    role: text().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.teamId, table.userId] }),
    checkRole: check("check_member_role", sql`${table.role} IN ('leader', 'member')`),
  }),
);

export const teamRelations = relations(team, ({ one, many }) => ({
  challenge: one(challenges, {
    fields: [team.challengeId],
    references: [challenges.id],
  }),
  teamMembers: many(teamMembers),
  leader: one(user, {
    fields: [team.leaderId],
    references: [user.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(team, {
    fields: [teamMembers.teamId],
    references: [team.id],
  }),
  user: one(user, {
    fields: [teamMembers.userId],
    references: [user.id],
  }),
}));

export type InsertTeam = typeof team.$inferInsert;
export type Team = typeof team.$inferSelect;
