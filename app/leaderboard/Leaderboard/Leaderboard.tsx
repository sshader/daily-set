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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Your leaderboards</h1>
      {leaderboards === undefined ? (
        <div>Loading...</div>
      ) : leaderboards.length === 0 ? (
        <div>No leaderboards found</div>
      ) : (
        <div className="flex flex-col gap-2">
          {leaderboards.map((leaderboard) => (
            <Link
              key={leaderboard._id}
              href={`/leaderboard/${leaderboard._id}`}
              className="border rounded-md p-2"
            >
              {leaderboard.name}
            </Link>
          ))}
        </div>
      )}
      <Button
        className="mr-auto"
        onClick={() => {
          void convex.mutation(api.leaderboard.create, {});
        }}
      >
        Create leaderboard
      </Button>
    </div>
  );
}
