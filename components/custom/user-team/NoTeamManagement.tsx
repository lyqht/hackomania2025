"use client";
import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { InsertTeam } from "@/utils/db/schema/team";
import { useRouter } from "next/navigation";
import ButtonLoadingSpinner from "../ButtonLoadingSpinner";
import { toast } from "sonner";

export default function NoTeamManagement() {
  const router = useRouter();

  const [joinTeamID, setJoinTeamID] = useState<string>("");
  const [createTeamInfo, setCreateTeamInfo] = useState<InsertTeam>({ name: "" });

  const [joinTeamPopup, setJoinTeamPopup] = useState(false);
  const [createTeamPopup, setCreateTeamPopup] = useState(false);

  const [error, setError] = useState<string | null>();
  const [isJoinPending, startJoinTransition] = useTransition();
  const [isCreatePending, startCreateTransition] = useTransition();

  const joinExistingTeam = async () => {
    if (isJoinPending) return;

    if (!joinTeamID) {
      setError("Team ID cannot be empty");
      return;
    }

    startJoinTransition(async () => {
      try {
        const res = await fetch(`/api/register/team/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId: joinTeamID }),
        });

        const data = await res.json();

        if (res.ok) {
          setJoinTeamPopup(false);
          setError(null);
          toast.success("Successfully joined team");
          router.refresh();
        } else {
          setError(data.error || "Failed to join team");
        }
      } catch (error) {
        setError("An unexpected error occurred");
        console.error(error);
      }
    });
  };

  const createTeam = async () => {
    if (isCreatePending) return;

    if (!createTeamInfo.name) {
      setError("Team Name cannot be empty");
      return;
    }

    startCreateTransition(async () => {
      try {
        const res = await fetch("/api/register/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamName: createTeamInfo.name,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setCreateTeamPopup(false);
          setError(null);
          toast.success("Successfully created team");
          router.refresh();
        } else {
          setError(data.error || "Failed to create team");
        }
      } catch (error) {
        setError("An unexpected error occurred");
        console.error(error);
      }
    });
  };

  return (
    <>
      <div className="flex w-full flex-row gap-5">
        <button
          className="rounded-lg border-2 border-hackomania-red p-3 py-2 text-center font-semibold text-hackomania-red duration-150 hover:bg-hackomania-red hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setJoinTeamPopup(true)}
          disabled={isJoinPending || isCreatePending}
        >
          {isJoinPending ? (
            <div className="flex items-center gap-2">
              <ButtonLoadingSpinner color="hackomania-red" />
              <span>Joining Team...</span>
            </div>
          ) : (
            "Join Existing Team"
          )}
        </button>
        <button
          className="rounded-lg bg-hackomania-red p-3 py-2 text-center text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setCreateTeamPopup(true)}
          disabled={isJoinPending || isCreatePending}
        >
          {isCreatePending ? (
            <div className="flex items-center gap-2">
              <ButtonLoadingSpinner color="white" />
              <span>Creating Team...</span>
            </div>
          ) : (
            "Create Team"
          )}
        </button>
      </div>

      {/* Join Team Popup */}
      {joinTeamPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => !isJoinPending && setJoinTeamPopup(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            exit={{ opacity: 0 }}
            className="m-5 rounded-lg bg-background p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold">Join an Existing Team</h3>
            <p>Enter the Team ID given to you by the Team Leader</p>
            <input
              type="text"
              placeholder="Team ID"
              className="mt-3 w-full rounded-lg border border-gray-500 bg-background p-2"
              value={joinTeamID}
              onChange={(e) => setJoinTeamID(e.target.value)}
              disabled={isJoinPending}
            />
            <button
              className="mt-3 w-full rounded-lg bg-hackomania-red p-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={joinExistingTeam}
              disabled={isJoinPending}
            >
              {isJoinPending ? (
                <div className="flex items-center justify-center gap-2">
                  <ButtonLoadingSpinner color="white" />
                  <span>Joining Team...</span>
                </div>
              ) : (
                "Join Team"
              )}
            </button>
            {error && <p className="mt-3 text-red-800">{error}</p>}
          </motion.div>
        </div>
      )}

      {/* Create Team Popup */}
      {createTeamPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => !isCreatePending && setCreateTeamPopup(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            exit={{ opacity: 0 }}
            className="m-5 rounded-lg bg-background p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold">Create a New Team</h3>
            <p>Create a new team and add your team members in</p>
            <input
              type="text"
              placeholder="Team Name"
              className="mt-3 w-full rounded-lg border border-gray-500 bg-background p-2"
              value={createTeamInfo.name}
              onChange={(e) => setCreateTeamInfo({ ...createTeamInfo, name: e.target.value })}
              disabled={isCreatePending}
            />
            <button
              className="mt-3 w-full rounded-lg bg-hackomania-red p-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={createTeam}
              disabled={isCreatePending}
            >
              {isCreatePending ? (
                <div className="flex items-center justify-center gap-2">
                  <ButtonLoadingSpinner color="white" />
                  <span>Creating Team...</span>
                </div>
              ) : (
                "Create Team"
              )}
            </button>
            {error && <p className="mt-3 text-red-800">{error}</p>}
          </motion.div>
        </div>
      )}
    </>
  );
}
