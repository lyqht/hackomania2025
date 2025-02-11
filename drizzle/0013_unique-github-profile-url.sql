CREATE UNIQUE INDEX "main_event_github_profile_url_idx" ON "main_event_registrations" USING btree ("github_profile_url");--> statement-breakpoint
ALTER TABLE "main_event_registrations" ADD CONSTRAINT "main_event_registrations_github_profile_url_unique" UNIQUE("github_profile_url");