import { pgTable } from "drizzle-orm/pg-core";
import { uuid, text, timestamp, unique, check } from "drizzle-orm/pg-core";
import { user } from "./user";
import { sql } from "drizzle-orm";

export const team = pgTable("team", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  leaderId: uuid().references(() => user.id),
});

export const teamMembers = pgTable(
  "team_members",
  {
    teamId: uuid()
      .references(() => team.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    role: text().notNull(),
  },
  (table) => ({
    // Ensures that each user can only be in one team at any time.
    uniqueConstraint: unique("uniqueTeamMember").on(table.teamId, table.userId),
    checkRole: check("check_member_role", sql`${table.role} IN ('leader', 'member')`),
  }),
);
