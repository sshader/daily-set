"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useConvex,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { formatDuration, intervalToDuration } from "date-fns";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SignInPage from "../signin/SignInPage";

export default function LeaderboardPage({}: {}) {
  const searchParams = useSearchParams();
  const leaderboardId = searchParams.get("i");
  const password = searchParams.get("p");
  const convex = useConvex();
  const { toast } = useToast();
  const router = useRouter();
  const leaderboardName = useQuery(api.leaderboard.getName, {
    leaderboardId: leaderboardId as Id<"leaderboard">,
  });

  return (
    <>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
      <Unauthenticated>
        <SignInPage redirectTo={`/invite?i=${leaderboardId}&p=${password}`} />
      </Unauthenticated>
      <Authenticated>
        <div>
          <Button
            onClick={() => {
              void convex
                .mutation(api.leaderboard.join, {
                  leaderboardId: leaderboardId as Id<"leaderboard">,
                  password: password as string,
                })
                .then((result) => {
                  if (result !== null) {
                    toast({
                      title: `Error joining leaderboard: ${result.reason}`,
                    });
                  } else {
                    router.push(`/leaderboard/${leaderboardId}`);
                  }
                });
            }}
          >{`Accept invite to ${leaderboardName ?? "..."}`}</Button>
        </div>
      </Authenticated>
    </>
  );
}
