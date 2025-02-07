"use server";

import { getUserById } from "@/app/services/user";
import { getUser } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";

export async function getUserFromSession() {
  try {
    const supabaseUser = (await getUser()) as User;
    if (!supabaseUser) {
      return null;
    }

    const user = await getUserById(supabaseUser.id);
    return user;
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}
