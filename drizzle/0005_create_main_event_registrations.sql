CREATE TABLE "main_event_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"github_profile_url" text,
	"linkedin_profile_url" text,
	"has_team" boolean NOT NULL,
	"team_name" text,
	"ticket_email" text,
	"approved_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "main_event_email_idx" ON "main_event_registrations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "team_name_idx" ON "main_event_registrations" USING btree ("team_name");