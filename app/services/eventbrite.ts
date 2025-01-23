import { createClient } from "@/utils/supabase/server";
import type { AttendeeMainInfo } from "@/types/eventbrite";

export async function checkEventbriteRegistration(email: string) {
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
