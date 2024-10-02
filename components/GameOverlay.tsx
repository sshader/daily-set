"use client";

import { useConvex, useConvexAuth, useQuery } from "convex/react";
import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Overlay } from "./Overlay";

export function GameOverlay({ puzzleId }: { puzzleId: Id<"puzzles"> }) {
  const { isAuthenticated } = useConvexAuth();
  const result = useQuery(api.play.loadStats, isAuthenticated ? {} : "skip");
  const convex = useConvex();
  if (result === undefined) {
    return <div>Loading...</div>;
  }
  const gameState = result.stats;
  if (gameState === null || gameState.state.kind === "NotStarted") {
    return (
      <Overlay>
        <Button
          onClick={() => {
            void convex.mutation(api.play.startGame, { puzzleId });
          }}
        >
          Start
        </Button>
      </Overlay>
    );
  }
  if (gameState.state.kind === "Paused") {
    return (
      <Overlay>
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
      </Overlay>
    );
  }
  return null;
}
