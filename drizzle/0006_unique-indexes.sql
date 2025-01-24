ALTER TABLE "team_members" DROP CONSTRAINT "uniqueTeamMember";--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_userId_pk" PRIMARY KEY("teamId","userId");--> statement-breakpoint
ALTER TABLE "main_event_registrations" ADD CONSTRAINT "main_event_registrations_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_name_unique" UNIQUE("name");