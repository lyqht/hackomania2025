"use client";

import { useState, useEffect } from "react";
import { Challenge, ChallengeMetadata } from "@/types/challenge";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface EditChallengeFormData {
  name: string;
  description: string;
  metadata: ChallengeMetadata;
}

export default function ChallengeManagement() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
    metadata: { teamQuota: 0 },
  });
  const [editData, setEditData] = useState<EditChallengeFormData | null>(null);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/challenges");
      if (!response.ok) throw new Error("Failed to fetch challenges");
      const data = await response.json();
      setChallenges(data || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Failed to fetch challenges");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleCreateChallenge = async () => {
    try {
      const response = await fetch("/api/admin/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChallenge),
      });

      if (!response.ok) throw new Error("Failed to create challenge");
      toast.success("Challenge created successfully");
      fetchChallenges();
      setNewChallenge({ name: "", description: "", metadata: { teamQuota: 0 } });
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error("Failed to create challenge");
    }
  };

  const handleUpdateChallenge = async () => {
    if (!editingChallengeId || !editData) return;

    try {
      const response = await fetch("/api/admin/challenges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingChallengeId, ...editData }),
      });

      if (!response.ok) throw new Error("Failed to update challenge");
      toast.success("Challenge updated successfully");
      fetchChallenges();
      setEditingChallengeId(null);
      setEditData(null);
    } catch (error) {
      console.error("Error updating challenge:", error);
      toast.error("Failed to update challenge");
    }
  };

  const startEditing = (challenge: Challenge) => {
    setEditingChallengeId(challenge.id);
    setEditData({
      name: challenge.name,
      description: challenge.description,
      metadata: challenge.metadata || { teamQuota: 0 },
    });
  };

  const cancelEditing = () => {
    setEditingChallengeId(null);
    setEditData(null);
  };

  return (
    <div className="rounded-lg border border-neutral-400 p-4">
      <div className="mb-4">
        <h2 className="mb-4 text-xl font-semibold">
          Challenges{" "}
          {challenges.length > 0 && (
            <span className="text-sm text-neutral-500">({challenges.length})</span>
          )}
        </h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create New Challenge</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newChallenge.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewChallenge({ ...newChallenge, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newChallenge.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewChallenge({ ...newChallenge, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teamQuota">Team Quota</Label>
                <Input
                  id="teamQuota"
                  type="number"
                  value={newChallenge.metadata.teamQuota}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewChallenge({
                      ...newChallenge,
                      metadata: { ...newChallenge.metadata, teamQuota: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <Button onClick={handleCreateChallenge}>Create Challenge</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading challenges...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Team Quota</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell>{challenge.name}</TableCell>
                <TableCell>{challenge.description}</TableCell>
                <TableCell>
                  {(challenge.metadata as ChallengeMetadata)?.teamQuota || "No quota"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingChallengeId === challenge.id}
                      onOpenChange={(open) => !open && cancelEditing()}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => startEditing(challenge)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Challenge</DialogTitle>
                        </DialogHeader>
                        {editData && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={editData.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setEditData({ ...editData, name: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={editData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                  setEditData({ ...editData, description: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="teamQuota">Team Quota</Label>
                              <Input
                                id="teamQuota"
                                type="number"
                                value={editData.metadata.teamQuota}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setEditData({
                                    ...editData,
                                    metadata: {
                                      ...editData.metadata,
                                      teamQuota: parseInt(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={cancelEditing}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateChallenge}>Save Changes</Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
