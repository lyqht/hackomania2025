import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { user } from "@/utils/db/schema/user";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    try {
      const supabase = await createClient();
      console.log("Exchanging code for session...");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }

      if (!session?.user) {
        console.error("No session or user found");
        throw new Error("No session or user found");
      }

      // Get GitHub username from user metadata
      const githubUsername = session.user.user_metadata.user_name;
      if (!githubUsername) {
        console.error("No GitHub username found in metadata");
        throw new Error("No GitHub username found in metadata");
      }

      // Check if user should be admin
      const adminUsers = process.env.ADMIN_USERS?.split(",") || [];
      const isAdmin = adminUsers.includes(githubUsername);

      // Create or update user in our database
      const [userRecord] = await db
        .insert(user)
        .values({
          id: session.user.id,
          email: session.user.email!,
          githubUsername,
          role: isAdmin ? "admin" : "participant",
          createdAt: new Date(),
        })
        .onConflictDoUpdate({
          target: user.githubUsername,
          set: {
            id: session.user.id,
            email: session.user.email!,
            role: isAdmin ? "admin" : "participant",
          },
        })
        .returning();

      // Redirect admin users to admin page
      if (userRecord.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`);
      }
    } catch (error) {
      console.error("Error in callback route:", error);
      // Return error response instead of redirecting
      return NextResponse.json({ error: "Failed to process authentication" }, { status: 500 });
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/user/home`);
}
