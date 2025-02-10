import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Pre-event registrations are fetched from eventbrite and stored in this table
export const preEventRegistrations = pgTable(
  "pre_event_registrations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: text("event_id").notNull(),
    attendeeId: text("attendee_id").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    gender: text("gender"),
    cellPhone: text("cell_phone"),
    checkedIn: boolean("checked_in").notNull().default(false),
    answers: jsonb("answers").array(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    eventAttendeeIdx: uniqueIndex("event_attendee_idx").on(table.eventId, table.attendeeId),
    emailIdx: index("email_idx").on(table.email),
  }),
);

// Main event registrations are fetched from google sheets and stored in this table
export const mainEventRegistrations = pgTable(
  "main_event_registrations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    githubProfileUrl: text("github_profile_url").unique(),
    linkedinProfileUrl: text("linkedin_profile_url"),
    hasTeam: boolean("has_team").notNull(),
    teamName: text("team_name"),
    ticketEmail: text("ticket_email"),
    approvedBy: text("approved_by"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("main_event_email_idx").on(table.email),
    githubProfileUrlIdx: uniqueIndex("main_event_github_profile_url_idx").on(
      table.githubProfileUrl,
    ),
    teamNameIdx: index("team_name_idx").on(table.teamName),
  }),
);
