import { db } from "@/utils/db";
import { mainEventRegistrations } from "@/utils/db/schema/eventbrite";
import { user } from "@/utils/db/schema/user";
import { NextResponse } from "next/server";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email(),
  githubUsername: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["participant", "admin"]).default("participant"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Create user
    const [newUser] = await db
      .insert(user)
      .values({
        email: validatedData.email,
        githubUsername: validatedData.githubUsername,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
      })
      .returning();

    // Add to main event registrations
    await db.insert(mainEventRegistrations).values({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      githubProfileUrl: `https://github.com/${validatedData.githubUsername}`,
      hasTeam: false,
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An error occurred while creating the user" },
      { status: 500 },
    );
  }
}
