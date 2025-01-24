"use client";

import { useState, useTransition, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import ButtonLoadingSpinner from "../ButtonLoadingSpinner";

export default function AddMembers({ teamId, numMembers }: { teamId: string; numMembers: number }) {
  const router = useRouter();
  const [memberUsernames, setMemberUsernames] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>();
  const [isPending, startTransition] = useTransition();
  const [lastFocusedIndex, setLastFocusedIndex] = useState<number | null>(null);

  const totalPotentialMembers = numMembers + memberUsernames.length;
  const remainingSlots = Math.max(0, 5 - totalPotentialMembers);
  const canAddMoreMembers = numMembers < 5;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (remainingSlots > 0) {
        setMemberUsernames([...memberUsernames, ""]);
        setLastFocusedIndex(currentIndex + 1);
      }
    }
  };

  const handleInputChange = (value: string, index: number) => {
    const newUsernames = [...memberUsernames];
    newUsernames[index] = value;
    setMemberUsernames(newUsernames);
  };

  const removeInput = (index: number) => {
    const newUsernames = memberUsernames.filter((_, i) => i !== index);
    setMemberUsernames(newUsernames.length ? newUsernames : [""]);
  };

  const handleAddMembers = async () => {
    if (isPending) return;

    const validUsernames = memberUsernames.filter((username) => username.trim() !== "");
    if (validUsernames.length === 0) {
      setError("At least one username is required");
      return;
    }

    if (validUsernames.length + numMembers > 5) {
      setError("Cannot add more members. Maximum team size is 5");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/register/team/member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamId: teamId,
            addUserUsernames: validUsernames,
          }),
        });

        if (res.ok) {
          setError(null);
          setMemberUsernames([""]);
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
      {canAddMoreMembers ? (
        <>
          <div className="flex w-full flex-col gap-2">
            {memberUsernames.map((username, index) => (
              <div key={index} className="flex w-full flex-row items-center gap-2">
                <div className="flex flex-grow items-center gap-2 rounded-lg p-1">
                  <label htmlFor={`github-username-${index}`} className="sr-only">
                    GitHub Username
                  </label>
                  <input
                    id={`github-username-${index}`}
                    type="text"
                    placeholder="Enter GitHub Username"
                    value={username}
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="flex-grow rounded-lg bg-background px-3 py-2 text-gray-900 placeholder-gray-500 outline-none ring-2 ring-gray-500 focus:ring-hackomania-red"
                    aria-label={`GitHub Username ${index + 1}`}
                    disabled={isPending}
                    autoFocus={index === lastFocusedIndex}
                    onFocus={() => setLastFocusedIndex(null)} // Reset after focus is handled
                  />
                </div>
                {memberUsernames.length > 1 && (
                  <button
                    onClick={() => removeInput(index)}
                    className="rounded-lg bg-red-200 px-3 py-2 text-red-900 transition duration-200 hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isPending}
                    aria-label="Remove input"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-sm text-neutral-500">
              {remainingSlots > 0 ? (
                <>Press Enter to add more usernames ({remainingSlots} slots remaining)</>
              ) : (
                <>Maximum number of inputs reached</>
              )}
            </p>
            <button
              onClick={handleAddMembers}
              className="rounded-lg bg-hackomania-red px-4 py-2 font-semibold text-white transition duration-200 ease-in-out hover:bg-red-700 focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Add members"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <ButtonLoadingSpinner color="white" />
                  <span>Adding...</span>
                </div>
              ) : (
                "Add Members"
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-red-900">{error}</p>}
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
