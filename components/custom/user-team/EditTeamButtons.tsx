"use client";

export default function EditTeamButtons({ teamID }: { teamID: string }) {
  const handleEditTeam = async () => {};

  const handleDeleteTeam = async () => {
    await fetch(`/api/register/team?id=${teamID}`, {
      method: "DELETE",
    });
  };

  return (
    <div className="flex flex-row gap-3 md:ml-auto">
      <button
        className="rounded-lg bg-blue-200 px-3 py-2 text-blue-900 hover:bg-blue-400"
        onClick={handleEditTeam}
      >
        Edit Team
      </button>
      <button
        className="rounded-lg bg-red-200 px-3 py-2 text-red-900 hover:bg-red-400"
        onClick={handleDeleteTeam}
      >
        Delete Team
      </button>
    </div>
  );
}
