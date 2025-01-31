import type { Database } from "@/types/database.types";
import type { AttendeeMainInfo } from "@/types/eventbrite";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function checkPreEventRegistration(email: string) {
  if (!email) {
    return { registered: false };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.functions.invoke<AttendeeMainInfo>(
      "fetch-eventbrite-attendees",
      {
        body: { email },
      },
    );

    if (error || !data) {
      console.error("Supabase Function error:", error);
      return { registered: false };
    }

    return { registered: true, data };
  } catch (error) {
    console.error("Error checking registration:", error);
    return { registered: false };
  }
}

export async function checkMainEventRegistration(email: string) {
  if (!email) {
    return { registered: false };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("main_event_registrations")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      return { registered: false };
    }

    return { registered: true, data };
  } catch (error) {
    console.error("Error checking main event registration:", error);
    return { registered: false };
  }
}

export async function syncPreEventRegistrations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const supabase = createSupabaseClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
  );

  // Call the Edge Function to sync pre-event registrations
  const { data, error } = await supabase.functions.invoke(
    "fetch-eventbrite-attendees",
    {
      body: { latest: true },
    },
  );

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

  const supabase = createSupabaseClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
  );

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
