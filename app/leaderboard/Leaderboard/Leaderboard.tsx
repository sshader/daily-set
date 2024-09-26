"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvex, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function Leaderboard() {
  const searchParams = useSearchParams();
  const shouldAutoNavigate = searchParams.get("s") === null;
  const leaderboards = useQuery(api.leaderboard.list);
  const router = useRouter();
  const convex = useConvex();
  useEffect(() => {
    if (
      shouldAutoNavigate &&
      leaderboards !== undefined &&
      leaderboards.length === 1
    ) {
      router.replace(`/leaderboard/${leaderboards[0]._id}`);
    }
  }, [leaderboards, router, shouldAutoNavigate]);
  return (
    <div>
      <div>Your leaderboards</div>
      {leaderboards === undefined ? (
        <div>Loading...</div>
      ) : leaderboards.length === 0 ? (
        <div>No leaderboards found</div>
      ) : (
        <div>
          {leaderboards.map((leaderboard) => (
            <Link
              key={leaderboard._id}
              href={`/leaderboard/${leaderboard._id}`}
            >
              {leaderboard.name}
            </Link>
          ))}
        </div>
      )}
      <Button
        onClick={() => {
          void convex.mutation(api.leaderboard.create, {});
        }}
      >
        Create leaderboard
      </Button>
    </div>
  );
}
