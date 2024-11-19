"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  CheckIcon,
  CommitIcon,
  DiscIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
import { useConvex, useConvexAuth, useQuery } from "convex/react";
import { formatDuration, intervalToDuration } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function LeaderboardPage({}: {}) {
  const params = useParams<{ id: string }>();
  const { isAuthenticated } = useConvexAuth();
  const info = useQuery(
    api.leaderboardStats.listTimes,
    isAuthenticated
      ? {
          leaderboardId: params.id as Id<"leaderboard">,
        }
      : "skip",
  );
  const viewer = useQuery(api.users.viewer);
  const [name, setName] = useState(info?.leaderboard.name ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const convex = useConvex();
  const { toast } = useToast();
  if (info === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold flex gap-2">
          {isEditing ? (
            <>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Button
                size={"icon"}
                onClick={() => {
                  convex
                    .mutation(api.leaderboard.setName, {
                      leaderboardId: params.id as Id<"leaderboard">,
                      name,
                    })
                    .then(() => {
                      setIsEditing(false);
                    });
                }}
              >
                <CheckIcon />
              </Button>
            </>
          ) : (
            <>
              {info.leaderboard.name}
              {viewer?._id === info.leaderboard.ownerId && (
                <Button
                  size={"icon"}
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  <Pencil1Icon />
                </Button>
              )}
            </>
          )}
        </div>
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
              <td>
                {index === 0
                  ? "🥇"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : index + 1}
              </td>
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
      <div className="flex gap-2">
        <Link href={`/leaderboard?s=1`}>
          <Button>See all leaderboards</Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => {
            void convex
              .query(api.leaderboard.getInvite, {
                leaderboardId: params.id as Id<"leaderboard">,
              })
              .then(({ _id, password }) => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/invite?i=${_id}&p=${password}`,
                );
                toast({
                  title: "Invite link copied",
                  description: "Paste this link to invite your friends!",
                });
              });
          }}
        >
          Invite friends!
        </Button>
      </div>
    </div>
  );
}
