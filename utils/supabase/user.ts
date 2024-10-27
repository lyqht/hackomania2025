import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function getUser({
  toRedirectToSignIn = true,
}: { toRedirectToSignIn?: boolean } = {}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (toRedirectToSignIn) {
      return redirect("/sign-in");
    }
    return null;
  }

  const { data: userData } = await supabase
    .from("user")
    .select("*")
    .eq("email", user.email as string)
    .single();

  return { ...user, ...userData };
}
