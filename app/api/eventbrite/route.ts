import { createClient } from "@/utils/supabase/server";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ registered: false });
  }

  try {
    const supabase = await createClient();

    if (!response.ok) {
      throw new Error("Failed to fetch Eventbrite data");
    }

    const data = await response.json();
    const registered = data.attendees && data.attendees.length > 0;

    return Response.json({ registered });
  } catch (error) {
    console.error("Error checking registration:", error);
    return Response.json({ registered: false });
  }
}
