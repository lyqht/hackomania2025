"use client";
import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { InsertTeam } from "@/utils/db/schema/team";

export default function NoTeamManagement() {
  const [joinTeamID, setJoinTeamID] = useState<string>("");
  const [createTeamInfo, setCreateTeamInfo] = useState<InsertTeam>();

  const [joinTeamPopup, setJoinTeamPopup] = useState(false);
  const [createTeamPopup, setCreateTeamPopup] = useState(false);

  const [isJoiningTeam, startJoiningTeam] = useTransition();
  const [isCreatingTeam, startCreatingTeam] = useTransition();

  const joinExistingTeam = async () => {
    startJoiningTeam(() => {});
  };

  const createTeam = async () => {
    startCreatingTeam(() => {});
  };

  return (
    <>
      <div className="flex w-full flex-row gap-5">
        <button
          className="rounded-lg border-2 border-hackomania-red p-3 py-2 text-center font-semibold text-hackomania-red duration-150 hover:bg-hackomania-red hover:text-white"
          onClick={() => setJoinTeamPopup(true)}
        >
          Join Existing Team
        </button>
        <button
          className="rounded-lg bg-hackomania-red p-3 py-2 text-center text-white"
          onClick={() => setCreateTeamPopup(true)}
        >
          Create Team
        </button>
      </div>

      {/* Join Team Popup */}
      {joinTeamPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setJoinTeamPopup(false)}
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
            />
            <button
              className={`mt-3 w-full rounded-lg bg-hackomania-red p-2 font-semibold text-white ${isJoiningTeam && "cursor-not-allowed"}`}
              onClick={joinExistingTeam}
            >
              {isJoiningTeam ? "Joining Team..." : "Join Team"}
            </button>
          </motion.div>
        </div>
      )}

      {/* Create Team Popup */}
      {createTeamPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setCreateTeamPopup(false)}
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
              value={createTeamInfo?.name}
              onChange={(e) => setCreateTeamInfo({ ...createTeamInfo, name: e.target.value })}
            />
            <button
              className={`mt-3 w-full rounded-lg bg-hackomania-red p-2 font-semibold text-white ${isCreatingTeam && "cursor-not-allowed"}`}
              onClick={createTeam}
            >
              {isCreatingTeam ? "Creating Team..." : "Create Team"}
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
