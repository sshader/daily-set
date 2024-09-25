import { Puzzle } from "@/components/Puzzle";
import PuzzleProvider from "@/components/PuzzleProvider";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
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
      {viewer === null ? (
        <Link href="/signin">
          <Button>Sign in</Button>
        </Link>
      ) : (
        <UserMenu>{viewer.name}</UserMenu>
      )}
      <Puzzle cards={puzzle.cards} />
    </PuzzleProvider>
  );
}
