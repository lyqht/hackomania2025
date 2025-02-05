"use client";

import { useState, useEffect, useMemo } from "react";
import { Challenge } from "@/types/challenge";
import { Team } from "@/app/services/team";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const MAX_TEAM_SIZE = 5;

type TeamFilter = "all" | "full" | "not-full";

export default function TeamManagement() {
  const [teams, setTeams] = useState<(Team & { challenge?: Challenge })[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/admin/challenges");
      if (!response.ok) throw new Error("Failed to fetch challenges");
      const data = await response.json();
      setChallenges(data || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Failed to fetch challenges");
    }
  };

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();

      // Enhance teams with their challenge data
      const teamsWithChallenges = data.map((team: Team) => ({
        ...team,
        challenge: challenges.find((c) => c.id === team.challengeId),
      }));

      setTeams(teamsWithChallenges);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to fetch teams");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (challenges.length > 0) {
      fetchTeams();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenges]);

  const handleAssignChallenge = async (teamId: string, challengeId: string | null) => {
    try {
      const response = await fetch("/api/challenges", {
        method: challengeId ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, challengeId }),
      });

      if (!response.ok) throw new Error("Failed to update team's challenge");
      toast.success("Team's challenge updated successfully");
      fetchTeams();
    } catch (error) {
      console.error("Error updating team's challenge:", error);
      toast.error("Failed to update team's challenge");
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team");
      toast.success("Team deleted successfully");
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    }
  };

  // Filter and search teams
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Apply search filter
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Apply team size filter
      switch (teamFilter) {
        case "full":
          return team.users.length >= MAX_TEAM_SIZE;
        case "not-full":
          return team.users.length < MAX_TEAM_SIZE;
        default:
          return true;
      }
    });
  }, [teams, searchQuery, teamFilter]);

  // Filter out admin teams from count
  const nonAdminTeamsCount = filteredTeams.filter(
    (team) => !team.users.some((user) => user.role === "admin"),
  ).length;

  return (
    <div className="rounded-lg border border-neutral-400 p-4">
      <div className="mb-4">
        <h2 className="mb-4 text-xl font-semibold">
          Teams{" "}
          {teams.length > 0 && (
            <span className="text-sm text-neutral-500">({nonAdminTeamsCount})</span>
          )}
        </h2>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]"
            />
          </div>

          <Select value={teamFilter} onValueChange={(value) => setTeamFilter(value as TeamFilter)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="full">Full Teams</SelectItem>
              <SelectItem value="not-full">Teams with Space</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div>Loading teams...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Current Challenge</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.map((team) => {
              const hasAdmin = team.users.some((user) => user.role === "admin");
              return (
                <TableRow key={team.id}>
                  <TableCell>
                    {team.name}{" "}
                    <span className="text-sm text-neutral-500">
                      ({team.users.length}/{MAX_TEAM_SIZE})
                    </span>
                  </TableCell>
                  <TableCell>
                    <ul className="list-inside list-disc">
                      {team.users.map((user) => (
                        <li key={user.id} className="text-sm">
                          {user.githubUsername}{" "}
                          <span
                            className={`text-neutral-500 ${user.role === "admin" ? "font-medium text-blue-600" : ""}`}
                          >
                            ({user.teamRole}){user.role === "admin" && " • Admin"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={team.challengeId || "none"}
                      onValueChange={(value) =>
                        handleAssignChallenge(team.id, value === "none" ? null : value)
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a challenge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Challenge</SelectItem>
                        {challenges.map((challenge) => (
                          <SelectItem key={challenge.id} value={challenge.id}>
                            {challenge.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Team</DialogTitle>
                          <DialogDescription>
                            {hasAdmin ? (
                              <div className="space-y-2">
                                <p className="font-medium text-blue-700">
                                  Info: This team contains admin users; likely it was created for
                                  testing purposes.
                                </p>
                                <p>
                                  Are you sure you want to delete this team? Team members will be
                                  able to join or create new teams.
                                </p>
                              </div>
                            ) : (
                              "Are you sure you want to delete this team? Team members will be able to join or create new teams."
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogTrigger>
                          <Button variant="destructive" onClick={() => handleDeleteTeam(team.id)}>
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
