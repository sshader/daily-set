"use client";

import { useConvex, useConvexAuth, useQuery } from "convex/react";
import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Overlay } from "./Overlay";
import { useEffect } from "react";
import Link from "next/link";

export function GameOverlay({ puzzleId }: { puzzleId: Id<"puzzles"> }) {
  const { isAuthenticated } = useConvexAuth();
  const result = useQuery(api.play.loadStats, isAuthenticated ? {} : "skip");
  const convex = useConvex();
  useEffect(() => {
    window.addEventListener("blur", () => {
      void convex.mutation(api.play.pauseGame, { puzzleId });
    });
  }, [convex, puzzleId]);
  if (result === undefined) {
    return <div>Loading...</div>;
  }
  const gameState = result.stats;
  if (gameState === null || gameState.state.kind === "NotStarted") {
    return (
      <Overlay>
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => {
              void convex.mutation(api.play.startGame, { puzzleId });
            }}
          >
            Start
          </Button>
          <div>
            New to Set? Read the{" "}
            <Link
              href="https://www.setgame.com/sites/default/files/instructions/SET%20INSTRUCTIONS%20-%20ENGLISH.pdf"
              target="_blank"
              className="underline"
            >
              instructions
            </Link>
          </div>
        </div>
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
