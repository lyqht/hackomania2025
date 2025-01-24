import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";
import type { Database, TablesInsert } from "../../../types/database.types.ts";
import type {
  AttendeeMainInfo,
  EventbriteAttendee,
  EventbriteResponse,
} from "../../../types/eventbrite.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function extractAttendeeMainInfo(
  attendee: EventbriteAttendee,
): TablesInsert<"eventbrite_registrations"> {
  return {
    checked_in: attendee.checked_in,
    ...attendee.profile,
    answers: attendee.answers,
  };
}

async function getAllAttendees(
  eventId: string,
  privateToken: string,
  forceLatest = false,
  supabaseClient: ReturnType<typeof createClient<Database>>,
): Promise<AttendeeMainInfo[]> {
  if (!forceLatest) {
    // Try to get from cache
    const { data: cachedAttendees, error } = await supabaseClient
      .from("eventbrite_registrations")
      .select("*")
      .eq("event_id", eventId)
      .order("updated_at", { ascending: true });

    if (!error && cachedAttendees.length > 0) {
      const oldestRecord = new Date(cachedAttendees[0].updated_at).getTime();
      if (Date.now() - oldestRecord < CACHE_DURATION) {
        return cachedAttendees.map((attendee) => ({
          checked_in: attendee.checked_in,
          first_name: attendee.first_name,
          last_name: attendee.last_name,
          email: attendee.email,
          name: attendee.name,
          gender: attendee.gender,
          cell_phone: attendee.cell_phone,
          answers: attendee.answers.map((ansQnPair) => ({
            answer: ansQnPair.answer,
            question: ansQnPair.question,
          })),
        }));
      }
    }
  }

  // Fetch from Eventbrite API
  const allAttendees: EventbriteAttendee[] = [];
  let continuation: string | undefined;

  do {
    const queryParams = continuation ? `?continuation=${continuation}` : "";
    const response = await fetch(
      `https://www.eventbriteapi.com/v3/events/${eventId}/attendees${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${privateToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Eventbrite API error: ${response.statusText}`);
    }

    const data = (await response.json()) as EventbriteResponse;
    allAttendees.push(...data.attendees);
    continuation = data.pagination.continuation;
  } while (continuation);

  // Update cache
  const attendeesToInsert: AttendeeMainInfo[] = allAttendees.map((
    attendee,
  ) => ({
    event_id: eventId,
    attendee_id: attendee.id,
    first_name: attendee.profile.first_name,
    last_name: attendee.profile.last_name,
    email: attendee.profile.email,
    name: attendee.profile.name,
    gender: attendee.profile.gender,
    cell_phone: attendee.profile.cell_phone,
    checked_in: attendee.checked_in,
    answers: attendee.answers,
  }));

  await supabaseClient.from("eventbrite_registrations").upsert(
    attendeesToInsert,
    {
      onConflict: "event_id,attendee_id",
      ignoreDuplicates: false,
    },
  );

  return allAttendees.map(extractAttendeeMainInfo);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const eventId = Deno.env.get("EVENTBRITE_EVENT_ID");
    const privateToken = Deno.env.get("EVENTBRITE_PRIVATE_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!eventId || !privateToken || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const forceLatest = url.searchParams.get("latest") === "1";

    const allAttendees = await getAllAttendees(
      eventId,
      privateToken,
      forceLatest,
      supabase,
    );

    if (email) {
      const foundAttendee = allAttendees.find(
        (attendee) => attendee.email.toLowerCase() === email.toLowerCase(),
      );

      if (!foundAttendee) {
        return new Response(JSON.stringify({ error: "Attendee not found" }), {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(JSON.stringify(foundAttendee), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({
        attendees: allAttendees,
        pagination: {
          object_count: allAttendees.length,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
