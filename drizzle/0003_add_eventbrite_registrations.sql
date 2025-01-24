CREATE TABLE "eventbrite_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"attendee_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"gender" text,
	"cell_phone" text,
	"checked_in" boolean DEFAULT false NOT NULL,
	"answers" jsonb[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'participant';--> statement-breakpoint
CREATE UNIQUE INDEX "event_attendee_idx" ON "eventbrite_registrations" USING btree ("event_id","attendee_id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "eventbrite_registrations" USING btree ("email");--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "check_member_role" CHECK ("team_members"."role" IN ('leader', 'member'));