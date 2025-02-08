"use client";

import { Team } from "@/app/services/team";
import { ExportTeamsAsExcelButton } from "@/components/custom/admin/ExportTeamsAsExcelButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Challenge } from "@/types/challenge";
import { Search, X, AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const MAX_TEAM_SIZE = 5;

type TeamFilter = "all" | "full" | "not-full";

interface TeamManagementProps {
  onNavigateToUser: (username: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export default function TeamManagement({
  onNavigateToUser,
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
}: TeamManagementProps) {
  const [teams, setTeams] = useState<(Team & { challenge?: Challenge })[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("all");
  const [hideUnregisteredTeams, setHideUnregisteredTeams] = useState(true);
  const [showSubmittedTeamsOnly, setShowSubmittedTeamsOnly] = useState(false);

  // Use external search query if provided, otherwise use internal state
  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const handleSearchQueryChange = (query: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(query);
    } else {
      setInternalSearchQuery(query);
    }
  };

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

  const handleRemoveAllChallenges = async () => {
    try {
      const response = await fetch("/api/challenges/remove-all", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to remove challenges from teams");
      toast.success("Successfully removed challenges from all teams");
      fetchTeams();
    } catch (error) {
      console.error("Error removing challenges:", error);
      toast.error("Failed to remove challenges from teams");
    }
  };

  // Filter and search teams
  const filteredTeams = useMemo(() => {
    return teams
      .filter((team) => {
        // Apply search filter
        const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // Apply team size filter
        const matchesTeamSize = (() => {
          switch (teamFilter) {
            case "full":
              return team.users.length >= MAX_TEAM_SIZE;
            case "not-full":
              return team.users.length < MAX_TEAM_SIZE;
            default:
              return true;
          }
        })();
        if (!matchesTeamSize) return false;

        // Apply challenge filter
        const matchesChallenge =
          selectedChallengeId === "all" ||
          (selectedChallengeId === "none"
            ? !team.challengeId
            : team.challengeId === selectedChallengeId);
        if (!matchesChallenge) return false;

        // Apply main event registration filter
        if (hideUnregisteredTeams && team.users.some((user) => !user.mainEventRegistered)) {
          return false;
        }

        // Apply submission filter
        if (showSubmittedTeamsOnly && !team.submission) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    teams,
    searchQuery,
    teamFilter,
    selectedChallengeId,
    hideUnregisteredTeams,
    showSubmittedTeamsOnly,
  ]);

  return (
    <div className="rounded-lg border border-neutral-400 p-4">
      <div className="mb-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Teams{" "}
            {teams.length > 0 && (
              <span className="text-sm text-neutral-500">({filteredTeams.length})</span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Unassign challenges from all teams
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Unassign challenges from all teams</DialogTitle>
                  <DialogDescription className="space-y-2">
                    <span className="block font-medium text-red-600">
                      ⚠️ Warning: This action cannot be undone!
                    </span>
                    This will remove the challenge that ALL teams have selected. Teams will need to
                    select their challenges again. Are you sure you want to proceed?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button variant="destructive" onClick={handleRemoveAllChallenges}>
                    Remove All Challenges
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <ExportTeamsAsExcelButton teams={filteredTeams} />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-neutral-500" />
              <div className="relative w-full sm:w-auto">
                <Input
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => handleSearchQueryChange(e.target.value)}
                  className="w-full pr-8 sm:w-[200px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchQueryChange("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <Select
              value={teamFilter}
              onValueChange={(value) => setTeamFilter(value as TeamFilter)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="full">Full Teams</SelectItem>
                <SelectItem value="not-full">Teams with Space</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedChallengeId} onValueChange={setSelectedChallengeId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Challenge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Challenges</SelectItem>
                <SelectItem value="none">No Challenge</SelectItem>
                {challenges.map((challenge) => (
                  <SelectItem key={challenge.id} value={challenge.id}>
                    {challenge.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="hideUnregisteredTeams"
                checked={hideUnregisteredTeams}
                onCheckedChange={(checked) => setHideUnregisteredTeams(checked as boolean)}
              />
              <label
                htmlFor="hideUnregisteredTeams"
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Hide teams with unregistered members
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="showSubmittedTeamsOnly"
                checked={showSubmittedTeamsOnly}
                onCheckedChange={(checked) => setShowSubmittedTeamsOnly(checked as boolean)}
              />
              <label
                htmlFor="showSubmittedTeamsOnly"
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Show only teams with project submissions
              </label>
            </div>
          </div>
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
              <TableHead>Submission Status</TableHead>
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
                          <button
                            onClick={() => onNavigateToUser(user.githubUsername)}
                            className="text-blue-600 hover:underline"
                          >
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName} (${user.githubUsername})`
                              : user.githubUsername}
                          </button>
                          {user.role === "admin" && (
                            <span className="ml-1 text-sm font-medium text-blue-600">• Admin</span>
                          )}
                          <span className="ml-1 text-sm text-neutral-500">
                            • {user.teamRole === "leader" ? "Leader" : "Member"}
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
                      <SelectTrigger className="w-[250px] truncate">
                        <SelectValue>
                          {team.challengeId
                            ? challenges.find((c) => c.id === team.challengeId)?.name ||
                              "No Challenge"
                            : "No Challenge"}
                        </SelectValue>
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
                    {team.challengeId ? (
                      team.submission ? (
                        <div className="text-sm">
                          <p className="text-green-600">✓ Submitted</p>
                          <div className="mt-1 space-y-1">
                            {team.submission.repoUrl && (
                              <a
                                href={team.submission.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline"
                              >
                                View Repository
                              </a>
                            )}
                            {team.submission.slidesUrl && (
                              <a
                                href={team.submission.slidesUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:underline"
                              >
                                View Slides
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-yellow-600">Not submitted yet</p>
                      )
                    ) : (
                      <p className="text-sm text-neutral-500">No challenge selected</p>
                    )}
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
