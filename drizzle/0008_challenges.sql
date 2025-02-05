CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"metadata" json,
	"created_at" text DEFAULT 'NOW()' NOT NULL,
	"updated_at" text DEFAULT 'NOW()' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "challengeId" uuid;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_challengeId_challenges_id_fk" FOREIGN KEY ("challengeId") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;