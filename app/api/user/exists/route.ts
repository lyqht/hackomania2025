import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { user } from "@/utils/db/schema/user";
import { eq } from "drizzle-orm";

// Note: This route takes in the user's GitHub Userna,e and check whether the user exists in the database
export async function GET(request: Request) {
  const requestBody = await request.json();
  const { ghUsername } = requestBody;

  if (!ghUsername) {
    return NextResponse.json({ error: "ghUsername is required" }, { status: 400 });
  }

  // Check if the user exists in the database
  const userExists = await db.select().from(user).where(eq(user.githubUsername, ghUsername));

  if (userExists.length === 0) {
    return NextResponse.json({ status: 404 });
  }

  return NextResponse.json({ status: 200 });
}
