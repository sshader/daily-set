"use client";

import { useConvex, useQuery } from "convex/react";
import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function GameOverlay({ puzzleId }: { puzzleId: Id<"puzzles"> }) {
  const result = useQuery(api.play.loadStats, {});
  const convex = useConvex();
  if (result === undefined) {
    return <div>Loading...</div>;
  }
  const gameState = result.stats;
  if (gameState === null || gameState.state.kind === "NotStarted") {
    return (
      <div className="z-50 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center fixed top-0 left-0">
        <Button
          onClick={() => {
            void convex.mutation(api.play.startGame, { puzzleId });
          }}
        >
          Start
        </Button>
      </div>
    );
  }
  if (gameState.state.kind === "Paused") {
    return (
      <div className="z-50 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center fixed top-0 left-0">
        <div className="flex flex-col gap-4">
          <div>Your game is paused.</div>
          <Button
            onClick={() => {
              void convex.mutation(api.play.unpauseGame, { puzzleId });
            }}
          >
            Unpause
          </Button>
        </div>
      </div>
    );
  }
  return null;
}
