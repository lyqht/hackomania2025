"use client";
import { FaCrown } from "react-icons/fa6";
import { LuUserMinus } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ITeamUser {
  id: string;
  githubUsername: string;
  role: string;
}

export default function TeamManagement({ users, teamId }: { users: ITeamUser[]; teamId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleRemoveUser = async (userId: string) => {
    try {
      setLoading(true);
      await fetch(`/api/register/team/member?id=${teamId}&userId=${userId}`, {
        method: "DELETE",
      });
      setLoading(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <p className="mb-1 text-lg font-semibold">Team Members</p>
      <div className="flex flex-col gap-2">
        <hr />
        {users.map((member: ITeamUser) => (
          <div key={member.id}>
            <div className="flex flex-row items-center gap-2">
              <p>{member.githubUsername}</p>
              {member.role === "leader" && <FaCrown />}
              <button
                className={`ml-auto text-xl ${loading && "cursor-not-allowed"} ${member.role === "leader" && "hidden"}`}
                onClick={() => handleRemoveUser(member.id)}
                disabled={loading}
              >
                <LuUserMinus />
              </button>
            </div>
            <hr className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
