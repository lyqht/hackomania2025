import { sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, check } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: uuid().defaultRandom().primaryKey(),
    email: text().notNull().unique(),
    githubUsername: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    role: text(),
},
    (table) => ({
        checkRole: check("role_verification", sql`${table.role} IN ('leader', 'member')`)
    })
);