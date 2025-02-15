"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface ChallengeStats {
  id: string;
  name: string;
  teamCount: number;
  teamQuota: number | null;
}

// Bar colors
const GREEN = "#4CAF50";
const BLUE = "#2196F3";
const PURPLE = "#9C27B0";

export default function ChallengeDashboard() {
  const [stats, setStats] = useState<ChallengeStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const CHALLENGE_COLORS = Object.fromEntries(
    stats.map((challenge, index) => [challenge.name, [GREEN, BLUE, PURPLE][index % 3]]),
  );

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/challenges/stats");
      if (!response.ok) throw new Error("Failed to fetch challenge statistics");
      const result = await response.json();
      setStats(result);
    } catch (error) {
      console.error("Error fetching challenge stats:", error);
      toast.error("Failed to fetch challenge statistics");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to team changes
    const channel = supabase
      .channel("team_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team",
        },
        () => {
          fetchStats();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (isLoading) {
    return <div>Loading challenge statistics...</div>;
  }

  return (
    <div className="container mx-auto min-h-screen p-8 md:p-20">
      <h1 className="mb-8 text-3xl font-bold">Challenge Statistics</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((challenge) => (
          <Card key={challenge.id} className="flex flex-col">
            <CardHeader className="grow">
              <CardTitle>
                <span className="block font-bold text-hackomania-red">
                  {challenge.name.split(" - ")[0]}
                </span>
                <span className="font-sans text-sm font-bold italic">
                  {challenge.name.split(" - ")[1]}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{challenge.teamCount}</div>
              <p className="text-xs text-muted-foreground">Teams registered</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Team Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => value.split(" - ")[0]}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="teamCount" name="Teams" radius={[4, 4, 0, 0]}>
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHALLENGE_COLORS[entry.name] || "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
