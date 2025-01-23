import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import type { EventbriteAttendee, EventbriteResponse, AttendeeMainInfo } from "./eventbrite.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractAttendeeMainInfo(attendee: EventbriteAttendee): AttendeeMainInfo {
  return {
    checked_in: attendee.checked_in,
    ...attendee.profile,
    answers: attendee.answers.map(({ answer, question }) => ({
      answer,
      question,
    })),
  };
}

async function getAllAttendees(
  eventId: string,
  privateToken: string,
): Promise<EventbriteAttendee[]> {
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

  return allAttendees;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const eventId = Deno.env.get("EVENTBRITE_EVENT_ID");
    const privateToken = Deno.env.get("EVENTBRITE_PRIVATE_TOKEN");
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!eventId || !privateToken) {
      throw new Error("Missing required environment variables");
    }

    const allAttendees = await getAllAttendees(eventId, privateToken);

    if (email) {
      const foundAttendee = allAttendees.find(
        (attendee) => attendee.profile.email.toLowerCase() === email.toLowerCase(),
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

      return new Response(JSON.stringify(extractAttendeeMainInfo(foundAttendee)), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({
        attendees: allAttendees.map(extractAttendeeMainInfo),
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
