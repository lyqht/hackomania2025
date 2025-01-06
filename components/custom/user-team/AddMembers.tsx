"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMembers({ teamId, numMembers }: { teamId: string; numMembers: number }) {
  const router = useRouter();
  const [newMemberUsername, setNewMemberUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const handleAddMember = async () => {
    setLoading(true);
    if (newMemberUsername === "") {
      setError("Username cannot be empty");
      return;
    }

    const res = await fetch("/api/register/team/member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: teamId,
        addUserUsernames: [newMemberUsername],
      }),
    });

    console.log(res);

    if (res.ok) {
      console.log("Success");
      console.log(await res.json());
      setError(null);
      setNewMemberUsername("");
      setLoading(false);
      router.refresh();
    } else {
      setError((await res.json()).error);
    }
  };

  return (
    <div>
      <p className="mb-1 text-lg font-semibold">Add Team Members</p>
      {numMembers < 5 ? (
        <>
          <div className="flex w-full flex-row items-center gap-2 rounded-lg border border-gray-500 bg-background p-2">
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
            />
            <button
              onClick={handleAddMember}
              className="rounded-lg bg-hackomania-red px-4 py-2 font-semibold text-white transition duration-200 ease-in-out hover:bg-red-700 focus:ring-2 focus:ring-red-300"
              aria-label="Add new member"
              disabled={loading}
            >
              Add
            </button>
          </div>
          <p className="text-red-900">{error}</p>
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
