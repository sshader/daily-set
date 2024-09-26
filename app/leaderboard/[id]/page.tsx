"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { formatDuration, intervalToDuration } from "date-fns";
import Link from "next/link";

export default function LeaderboardPage({
  params,
}: {
  params: { id: string };
}) {
  const info = useQuery(api.leaderboardStats.listTimes, {
    leaderboardId: params.id as Id<"leaderboard">,
  });
  if (info === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold">{info.leaderboard.name}</div>
        <table className="text-left">
          <thead>
            <tr>
              <th className="w-20">Rank</th>
              <th className="w-80">User</th>
              <th className="w-80">Time</th>
            </tr>
          </thead>
          {info.stats.map((stat, index) => (
            <tr key={stat.user._id}>
              <td>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</td>
              <td>{stat.user.name}</td>
              <td>
                {stat.timeToSolveMs === null
                  ? "Not solved"
                  : formatDuration(
                      intervalToDuration({
                        start: 0,
                        end: stat.timeToSolveMs,
                      }),
                      {
                        format: ["minutes", "seconds"],
                      },
                    )}
              </td>
            </tr>
          ))}
        </table>
      </div>
      <Link href={`/leaderboard?s=1`}>
        <Button>See all leaderboards</Button>
      </Link>
    </div>
  );
}
