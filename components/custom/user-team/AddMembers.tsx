"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ButtonLoadingSpinner from "../ButtonLoadingSpinner";

export default function AddMembers({ teamId, numMembers }: { teamId: string; numMembers: number }) {
  const router = useRouter();
  const [newMemberUsername, setNewMemberUsername] = useState<string>("");
  const [error, setError] = useState<string | null>();
  const [isPending, startTransition] = useTransition();

  const handleAddMember = async () => {
    if (isPending) return;

    if (newMemberUsername === "") {
      setError("Username cannot be empty");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/register/team/member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamId: teamId,
            addUserUsernames: [newMemberUsername],
          }),
        });

        if (res.ok) {
          setError(null);
          setNewMemberUsername("");
          router.refresh();
        } else {
          setError((await res.json()).error);
        }
      } catch (error) {
        setError("An unexpected error occurred");
        console.error(error);
      }
    });
  };

  return (
    <div>
      <p className="mb-1 text-lg font-semibold">Add Team Members</p>
      {numMembers < 5 ? (
        <>
          <div className="flex w-full flex-row items-center gap-2 rounded-lg border border-gray-500 bg-background p-1">
            <label htmlFor="github-username" className="sr-only">
              GitHub Username
            </label>
            <input
              id="github-username"
              type="text"
              placeholder="Enter GitHub Username"
              value={newMemberUsername}
              onChange={(e) => setNewMemberUsername(e.target.value)}
              className="flex-grow rounded-lg bg-background px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-hackomania-red"
              aria-label="GitHub Username"
              disabled={isPending}
            />
            <button
              onClick={handleAddMember}
              className="rounded-lg bg-hackomania-red px-4 py-2 font-semibold text-white transition duration-200 ease-in-out hover:bg-red-700 focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Add new member"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <ButtonLoadingSpinner color="white" />
                  <span>Adding...</span>
                </div>
              ) : (
                "Add"
              )}
            </button>
          </div>
          {error && <p className="text-red-900">{error}</p>}
        </>
      ) : (
        <div>
          <p className="text-neutral-500">
            You have reached the maximum number of members allowed in a team. Remove an existing
            member before continuing to add more.
          </p>
        </div>
      )}
    </div>
  );
}
