"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "motion/react";
import ButtonLoadingSpinner from "../ButtonLoadingSpinner";

export default function EditTeamButtons({ teamID }: { teamID: string }) {
  const [editTeamPopup, setEditTeamPopup] = useState<boolean>(false);
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [error, setError] = useState<string | null>();
  const [isEditPending, startEditTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const router = useRouter();

  const handleEditTeam = async () => {
    if (isEditPending) return;

    startEditTransition(async () => {
      const editRes = await fetch("/api/register/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: teamID,
          teamName: newTeamName,
        }),
      });

      if (editRes.ok) {
        router.refresh();
        setNewTeamName("");
        setError(null);
        setEditTeamPopup(false);
      } else {
        setError((await editRes.json()).error);
      }
    });
  };

  const handleDeleteTeam = async () => {
    if (isDeletePending) return;

    if (confirm("Are you sure you want to delete your team? This process is irreversible.")) {
      startDeleteTransition(async () => {
        const deleteRes = await fetch(`/api/register/team?id=${teamID}`, {
          method: "DELETE",
        });

        if (deleteRes.ok) {
          router.refresh();
        }
      });
    }
  };

  return (
    <div className="flex flex-row gap-3 md:ml-auto">
      <button
        className="rounded-lg bg-blue-200 px-3 py-2 text-blue-900 duration-150 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setEditTeamPopup(true)}
        disabled={isEditPending || isDeletePending}
      >
        {isEditPending ? <ButtonLoadingSpinner /> : "Edit Team"}
      </button>
      <button
        className="rounded-lg bg-red-200 px-3 py-2 text-red-900 duration-150 hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleDeleteTeam}
        disabled={isEditPending || isDeletePending}
      >
        {isDeletePending ? <ButtonLoadingSpinner /> : <p>Delete Team</p>}
      </button>

      {editTeamPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setEditTeamPopup(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            exit={{ opacity: 0 }}
            className="m-5 rounded-lg bg-background p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold">Edit Team Name</h3>
            <input
              type="text"
              placeholder="New Team Name"
              className="mt-3 w-full rounded-lg border border-gray-500 bg-background p-2"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              disabled={isEditPending}
            />
            <button
              className={`mt-3 w-full rounded-lg bg-hackomania-red p-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50`}
              onClick={handleEditTeam}
              disabled={isEditPending}
            >
              {isEditPending ? "Updating Name..." : "Update Team Name"}
            </button>
            {error && <p className="mt-3 text-red-800">{error}</p>}
          </motion.div>
        </div>
      )}
    </div>
  );
}
