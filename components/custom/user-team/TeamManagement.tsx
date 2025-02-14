"use client";
import { FaCrown } from "react-icons/fa6";
import { LuUserMinus } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { UserInfo } from "@/app/services/user";
import { Team } from "@/app/services/team";

export default function TeamManagement({
  currentUser,
  userTeam,
}: {
  currentUser: UserInfo;
  userTeam: Team;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const teamHasLeader = userTeam?.leaderId !== null;

  const handleRemoveUser = async (userId: string) => {
    try {
      setLoading(true);
      await fetch(`/api/register/team/member?id=${userTeam.id}&userId=${userId}`, {
        method: "DELETE",
      });
      setLoading(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove user from team");
    }
  };

  const handleLeaveTeam = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/register/team/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId: userTeam.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        throw new Error(data.error || "Failed to leave team");
      }

      toast.success("Successfully left team");
      router.refresh();
      router.push("/user/home");
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to leave team");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppointLeader = async () => {
    if (teamHasLeader) {
      return;
    }
    try {
      setLoading(true);
      await fetch(`/api/register/team/appointleader`, {
        method: "PUT",
        body: JSON.stringify({ teamId: userTeam.id }),
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
        {userTeam.users.map((member: UserInfo) => (
          <div key={member.id}>
            <div className="flex flex-row items-center gap-2">
              <p>{member.githubUsername}</p>
              {member.teamRole === "leader" && <FaCrown />}
              <div className="ml-auto">
                {!teamHasLeader && (
                  <button
                    className="rounded-md bg-hackomania-red px-2 py-1 text-white"
                    onClick={handleAppointLeader}
                  >
                    Appoint Leader
                  </button>
                )}
                {currentUser.teamRole === "leader" &&
                  member.githubUsername != currentUser.githubUsername && (
                    <button
                      className={`ml-4 text-xl ${loading && "cursor-not-allowed"} ${member.role === "leader" && "hidden"}`}
                      onClick={() => handleRemoveUser(member.id)}
                      disabled={loading}
                    >
                      <LuUserMinus />
                    </button>
                  )}
              </div>
            </div>
            <hr className="mt-2" />
          </div>
        ))}
      </div>

      {currentUser.teamRole !== "leader" && (
        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={loading}>
                Leave Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Team</DialogTitle>
                <DialogDescription className="space-y-2">
                  <span className="block">Are you sure you want to leave this team?</span>
                  <span className="font-medium text-red-600">
                    ⚠️ Warning: This action cannot be undone. You will need to join or create a new
                    team.
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button variant="destructive" onClick={handleLeaveTeam} disabled={loading}>
                  Leave Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <Toaster />
    </div>
  );
}
