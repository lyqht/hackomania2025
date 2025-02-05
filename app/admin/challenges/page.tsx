"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface ChallengeStats {
  id: string;
  name: string;
  teamCount: number;
  teamQuota: number | null;
}

export default function ChallengeDashboard() {
  const [stats, setStats] = useState<ChallengeStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

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
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Challenge Statistics</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader>
              <CardTitle>{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.teamCount} / {stat.teamQuota || "∞"}
              </div>
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="teamCount" fill="#3b82f6" name="Teams" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
