ALTER TABLE "team" DROP CONSTRAINT "team_leaderId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_leaderId_user_id_fk" FOREIGN KEY ("leaderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;