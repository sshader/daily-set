import { UserMenu } from "@/components/UserMenu";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { Leaderboard } from "./Leaderboard/Leaderboard";
import { HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LeaderboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await fetchQuery(
    api.users.viewer,
    {},
    { token: convexAuthNextjsToken() },
  );
  return (
    <main className="flex max-h-screen grow flex-col overflow-hidden">
      <div className="flex items-start justify-between border-b p-4">
        <Link href="/">
          <Button variant="secondary" size="icon" className="rounded-full">
            <HomeIcon className="h-4 w-4" />
          </Button>
        </Link>
        <UserMenu>{viewer?.name ?? viewer?.email}</UserMenu>
      </div>
      {children}
    </main>
  );
}
