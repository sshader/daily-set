import { Puzzle } from "@/components/Puzzle";
import PuzzleProvider from "@/components/PuzzleProvider";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import {
  convexAuthNextjsToken,
  isAuthenticatedNextjs,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { GameOverlay } from "@/components/GameOverlay";
import { GameStats } from "@/components/GameStats";
import { Id } from "@/convex/_generated/dataModel";
import { Overlay } from "@/components/Overlay";
import Link from "next/link";

export default async function HomePage() {
  const puzzle = await fetchQuery(api.play.loadGame, {});
  const viewer = await fetchQuery(
    api.users.viewer,
    {},
    {
      token: convexAuthNextjsToken(),
    },
  );
  return (
    <PuzzleProvider puzzleId={puzzle._id}>
      <div className="flex flex-col justify-center items-center h-full w-full">
        <GameOverlayWrapper puzzleId={puzzle._id} />
        <div className="flex flex-row flex-wrap w-full gap-8 p-10">
          <div className="max-w-3/4 overflow-auto">
            <Puzzle
              cards={puzzle.cards}
              colorPalette={viewer?.colorPalette ?? "default"}
            />
          </div>
          <div className="flex-grow max-w-1/2 overflow-auto">
            {isAuthenticatedNextjs() ? (
              <GameStats puzzleId={puzzle._id} />
            ) : null}
          </div>
        </div>
      </div>
    </PuzzleProvider>
  );
}

async function GameOverlayWrapper({ puzzleId }: { puzzleId: Id<"puzzles"> }) {
  if (isAuthenticatedNextjs()) {
    return <GameOverlay puzzleId={puzzleId} />;
  } else {
    return (
      <Overlay>
        <div className="flex flex-col gap-4 items-center">
          <div>Please sign in to start playing.</div>
          <Link href="/signin">
            <Button>Sign in</Button>
          </Link>
        </div>
      </Overlay>
    );
  }
}
