import type { Database } from "@/types/database.types";
import { db } from "@/utils/db";
import { preEventRegistrations } from "@/utils/db/schema/eventbrite";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { sql } from "drizzle-orm";
import { UserInfo } from "./user";

export interface RegistrationStatus {
  preEventRegistered: boolean;
  mainEventRegistered: boolean;
}

export async function checkRegistrationStatus(user: UserInfo): Promise<RegistrationStatus> {
  try {
    const result = await db
      .select({
        preEventRegistered: sql<boolean>`EXISTS (
          SELECT 1 FROM ${preEventRegistrations}
          WHERE ${preEventRegistrations.email} = ${user.email}
        )`,
        mainEventRegistered: sql<boolean>`EXISTS (
          SELECT 1 FROM main_event_registrations
          WHERE SUBSTRING(main_event_registrations.github_profile_url FROM 'github.com/([^/]+)') = ${user.githubUsername}
        )`,
      })
      .from(sql`(SELECT 1) as dummy`);

    return result[0] || { preEventRegistered: false, mainEventRegistered: false };
  } catch (error) {
    console.error("Error checking registration status:", error);
    return { preEventRegistered: false, mainEventRegistered: false };
  }
}

export async function syncPreEventRegistrations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey);

  // Call the Edge Function to sync pre-event registrations
  const { data, error } = await supabase.functions.invoke("fetch-eventbrite-attendees", {
    body: { latest: true },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadMainEventRegistrations(file: File) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey);

  const formData = new FormData();
  formData.append("file", file);

  // Call the Edge Function to process the file
  const { data, error } = await supabase.functions.invoke(
    "prepopulate-google-sheets-main-event-registrations",
    {
      body: formData,
    },
  );

  if (error) {
    throw error;
  }

  return data;
}
