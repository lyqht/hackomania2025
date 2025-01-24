import { createClient } from "@/utils/supabase/server";
import type { AttendeeMainInfo } from "@/types/eventbrite";

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
