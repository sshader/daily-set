import { Leaderboard } from "./Leaderboard/Leaderboard";

export default async function LeaderboardPage() {
  return (
    <main className="flex max-h-screen grow flex-col overflow-hidden">
      <Leaderboard />
    </main>
  );
}
