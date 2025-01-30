"use client";
import { FaCrown } from "react-icons/fa6";
import { LuUserMinus } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

interface ITeamUser {
  id: string;
  githubUsername: string;
  role: string;
  email: string;
}

export default function TeamManagement({ users, teamId }: { users: ITeamUser[]; teamId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [memberRegistrationStatus, setMemberRegistrationStatus] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const statusMap: Record<string, boolean> = {};
      for (const user of users) {
        const eventRegistrationRequest = await fetch(
          `/api/eventbrite/checkregistration?email=${user.email}`,
        );
        const eventRegistrationResponse = await eventRegistrationRequest.json();
        statusMap[user.id] = eventRegistrationResponse.registered;
      }
      setMemberRegistrationStatus(statusMap);
    };

    fetchRegistrationStatus();
  }, []);

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
        {users.map(async (member: ITeamUser) => (
          <Suspense key={member.id} fallback={<div>Loading...</div>}>
            <div>
              <div className="flex flex-row items-center gap-2">
                <p>
                  {member.githubUsername}{" "}
                  <span
                    className={
                      memberRegistrationStatus[member.id] ? "text-emerald-600" : "text-red-700"
                    }
                  >
                    ({memberRegistrationStatus[member.id] ? "Registered" : "Not Registered"})
                  </span>
                </p>
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
          </Suspense>
        ))}
      </div>
    </div>
  );
}
