import { Puzzle } from "@/components/Puzzle";
import PuzzleProvider from "@/components/PuzzleProvider";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";
import { GameOverlay } from "@/components/GameOverlay";
import { GameStats } from "@/components/GameStats";

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
      <div className="w-screen h-screen flex flex-col gap-10">
        <div className="flex flex-row justify-end">
          {viewer === null ? (
            <Link href="/signin">
              <Button>Sign in</Button>
            </Link>
          ) : (
            <UserMenu>{viewer.name ?? viewer.email}</UserMenu>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-center">
            <GameOverlay puzzleId={puzzle._id} />
            <div className="flex flex-row">
              <Puzzle cards={puzzle.cards} />
              <GameStats puzzleId={puzzle._id} />
            </div>
          </div>
        </div>
      </div>
    </PuzzleProvider>
  );
}
