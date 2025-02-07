"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";

export default function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createClient();

    try {
      // Sign out on client side
      await supabase.auth.signOut();

      // Call server-side sign out
      await fetch("/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button onClick={handleSignOut} variant="outline">
      Sign Out
    </Button>
  );
}
