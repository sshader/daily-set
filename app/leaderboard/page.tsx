import { UserMenu } from "@/components/UserMenu";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { Leaderboard } from "./Leaderboard/Leaderboard";

export default async function LeaderboardPage() {
  return (
    <main className="flex max-h-screen grow flex-col overflow-hidden">
      <Leaderboard />
    </main>
  );
}
