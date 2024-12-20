"use client";

import { getCardForDisplay } from "@/common/cards";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvex, useConvexAuth, useQuery } from "convex/react";
import { Card } from "./Card";
import { Button } from "./ui/button";
import Link from "next/link";
import { formatDuration, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

export function GameStats({ puzzleId }: { puzzleId: Id<"puzzles"> }) {
  const { isAuthenticated } = useConvexAuth();
  const result = useQuery(api.play.loadStats, isAuthenticated ? {} : "skip");
  const viewer = useQuery(api.users.viewer, {});
  const convex = useConvex();
  if (result === undefined) {
    return <div>Loading...</div>;
  }
  const { stats, totalSets } = result;
  if (
    stats === null ||
    stats.state.kind === "NotStarted" ||
    stats.state.kind === "Paused"
  ) {
    return null;
  }
  if (stats.state.kind === "InProgress") {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row gap-2">
          <Button
            onClick={() => {
              void convex.mutation(api.play.pauseGame, { puzzleId });
            }}
          >
            Pause
          </Button>
          <Timer
            timeElapsedMs={stats.state.timeElapsedMsBeforeStart}
            startTime={stats.state.startedAt}
          />
        </div>
        <div>{`Sets found: ${stats.state.setsFound.length} / ${totalSets}`}</div>
        {stats.state.setsFound.map((s, idx) => {
          return (
            <div key={idx} className="flex flex-row">
              {s.map((c) => {
                return (
                  <Card
                    key={c}
                    size="Small"
                    card={getCardForDisplay(c)}
                    colorPalette={viewer?.colorPalette ?? "default"}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
  if (stats.state.kind === "Solved") {
    return (
      <div>
        <div>Solved!</div>
        <div>{`Total time: ${formatDuration(
          intervalToDuration({
            start: 0,
            end: stats.state.timeElapsedMs,
          }),
          { format: ["minutes", "seconds"] },
        )}`}</div>
        <Link href="/leaderboard">
          <Button>See leaderboard</Button>
        </Link>
        <div className="flex flex-col">
          <div>{`Sets found: ${stats.state.setsFound.length} / ${totalSets}`}</div>
          {stats.state.setsFound.map((s, idx) => {
            return (
              <div key={idx} className="flex flex-row">
                {s.map((c) => {
                  return (
                    <Card
                      key={c}
                      size="Small"
                      card={getCardForDisplay(c)}
                      colorPalette={viewer?.colorPalette ?? "default"}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function Timer({
  timeElapsedMs,
  startTime,
}: {
  timeElapsedMs: number;
  startTime: number;
}) {
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdate(update + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [update]);
  return (
    <div className="flex bg-secondary text-white rounded-md items-center px-2">
      {formatDuration(
        intervalToDuration({
          start: 0,
          end: timeElapsedMs + Date.now() - startTime,
        }),
        {
          format: ["minutes", "seconds"],
          zero: true,
        },
      )}
    </div>
  );
}
