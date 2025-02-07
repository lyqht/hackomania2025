import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  // Sign out on server-side
  await supabase.auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}/`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
