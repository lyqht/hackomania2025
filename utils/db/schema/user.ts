import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: uuid().defaultRandom().primaryKey(),
    email: text().notNull().unique(),
    githubUsername: text().notNull().unique(),
    firstName: text(),
    lastName: text(),
    createdAt: timestamp().notNull().defaultNow(),
    role: text().default("participant"),
  },
  (table) => ({
    checkRole: check("role_verification", sql`${table.role} IN ('admin', 'participant')`),
  }),
);

export type SelectUser = typeof user.$inferSelect;
