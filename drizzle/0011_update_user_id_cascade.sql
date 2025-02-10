ALTER TABLE "team_members" DROP CONSTRAINT "team_members_teamId_team_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;