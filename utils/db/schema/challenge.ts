import { json, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { team } from "./team";
import { relations } from "drizzle-orm";

export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  metadata: json("metadata").$type<{
    judges?: string[];
    teamQuota?: number;
    [key: string]: unknown;
  }>(),
  createdAt: text("created_at").notNull().default("NOW()"),
  updatedAt: text("updated_at").notNull().default("NOW()"),
});

export const challengeRelations = relations(challenges, ({ many }) => ({
  teams: many(team),
}));

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;
