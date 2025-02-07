"use client";

import { useState } from "react";

export default function GitHubSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex items-center justify-between gap-2">
      <p>Received an invitation for the main event?</p>
      <a
        href="/auth/github"
        className="flex items-center gap-2 rounded-md bg-hackomania-red px-4 py-2 text-white"
        onClick={() => setIsLoading(true)}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Signing in...</span>
          </>
        ) : (
          "Sign in with GitHub"
        )}
      </a>
    </div>
  );
}
