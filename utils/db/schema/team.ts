import { pgTable } from "drizzle-orm/pg-core";
import { uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./user";

export const team = pgTable("team", {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    leaderId: uuid().references(() => user.id),
});

export const teamMembers = pgTable("team_members", {
    teamId: uuid().references(() => team.id).notNull(),
    userId: uuid().references(() => user.id).notNull(),
}, (table) => ({
    // Ensure each user can only be associated with a team once
    uniqueConstraint: unique("uniqueTeamMember").on(table.teamId, table.userId),
}));
