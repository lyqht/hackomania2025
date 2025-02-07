import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabaseClient = await createClient();

    const { error } = await supabaseClient
      .from("team")
      .update({ challengeId: null })
      .not("challengeId", "is", null);

    if (error) throw error;

    return NextResponse.json({
      message: "Successfully removed all team challenges",
    });
  } catch (error) {
    console.error("Error removing team challenges:", error);
    return NextResponse.json({ error: "Failed to remove team challenges" }, { status: 500 });
  }
}
