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

export const eventbritePreEvent = pgTable(
  "eventbrite_registrations",
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
    eventAttendeeIdx: uniqueIndex("event_attendee_idx").on(
      table.eventId,
      table.attendeeId,
    ),
    emailIdx: index("email_idx").on(table.email),
  }),
);
