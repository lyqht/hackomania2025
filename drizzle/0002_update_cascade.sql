ALTER TABLE "user" DROP CONSTRAINT "role_verification";--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_teamId_team_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "role" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "check_member_role" CHECK ("team_members"."role" IN ('leader', 'member'));--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "role_verification" CHECK ("user"."role" IN ('admin', 'participant'));