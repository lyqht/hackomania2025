import { createClient } from "@/utils/supabase/server";
import type { AttendeeMainInfo } from "../../../types/eventbrite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ registered: false });
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
      return Response.json({ registered: false });
    }

    return Response.json({ registered: true, data });
  } catch (error) {
    console.error("Error checking registration:", error);
    return Response.json({ registered: false });
  }
}
