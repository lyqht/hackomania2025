CREATE TABLE IF NOT EXISTS "team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"leaderId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_members" (
	"teamId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "uniqueTeamMember" UNIQUE("teamId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"githubUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"role" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "role_verification" CHECK ("user"."role" IN ('leader', 'member'))
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team" ADD CONSTRAINT "team_leaderId_user_id_fk" FOREIGN KEY ("leaderId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
