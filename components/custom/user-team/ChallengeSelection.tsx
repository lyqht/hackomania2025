"use client";

import { useEffect, useState } from "react";
import { Challenge } from "@/types/challenge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ChallengeSelectionProps {
  teamId: string;
  currentChallengeId?: string | null;
}

export default function ChallengeSelection({
  teamId,
  currentChallengeId,
}: ChallengeSelectionProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    currentChallengeId || null,
  );

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/challenges");
        if (!response.ok) throw new Error("Failed to fetch challenges");
        const data = await response.json();
        setChallenges(data || []);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to fetch challenges");
      }
      setIsLoading(false);
    };

    fetchChallenges();
  }, []);

  const handleChallengeSelect = async (challengeId: string) => {
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, challengeId }),
      });

      if (!response.ok) throw new Error("Failed to join challenge");
      setSelectedChallengeId(challengeId);
      toast.success("Successfully joined challenge");
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast.error("Failed to join challenge");
    }
  };

  const handleChallengeLeave = async () => {
    try {
      const response = await fetch("/api/challenges", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });

      if (!response.ok) throw new Error("Failed to leave challenge");
      setSelectedChallengeId(null);
      toast.success("Successfully left challenge");
    } catch (error) {
      console.error("Error leaving challenge:", error);
      toast.error("Failed to leave challenge");
    }
  };

  if (isLoading) {
    return <div>Loading challenges...</div>;
  }

  const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Challenge Selection</h3>
        <p className="text-sm text-neutral-500">
          Select a challenge for your team to participate in.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={selectedChallengeId || ""}
          onValueChange={handleChallengeSelect}
          disabled={challenges.length === 0}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a challenge" />
          </SelectTrigger>
          <SelectContent>
            {challenges.map((challenge) => (
              <SelectItem key={challenge.id} value={challenge.id}>
                {challenge.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedChallengeId && (
          <Button variant="outline" onClick={handleChallengeLeave}>
            Leave Challenge
          </Button>
        )}
      </div>

      {selectedChallenge && (
        <div className="rounded-lg border p-4">
          <h4 className="font-medium">{selectedChallenge.name}</h4>
          <p className="mt-1 text-sm text-neutral-500">{selectedChallenge.description}</p>
          {selectedChallenge.metadata && (
            <div className="mt-2 text-sm">
              <p>
                <span className="font-medium">Team Quota: </span>
                {(selectedChallenge.metadata as { teamQuota?: number })?.teamQuota || "No quota"}
              </p>
              {/* TODO: add judges when confirmed on 2nd day */}
              {/* {(selectedChallenge.metadata as { judges?: string[] })?.judges && (
                <p>
                  <span className="font-medium">Judges: </span>
                  {(selectedChallenge.metadata as { judges?: string[] }).judges?.join(", ")}
                </p>
              )} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
