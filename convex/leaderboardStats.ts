import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import {
  ensureLeaderboard,
  getMembership,
  getMemberships,
} from "./model/leaderboard";
import * as Cards from "./model/cards";

export const listTimes = query({
  args: {
    leaderboardId: v.id("leaderboard"),
    day: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leaderboard = await ensureLeaderboard(ctx, args.leaderboardId);
    const { membership } = await getMembership(ctx, leaderboard);
    if (membership === null) {
      throw new ConvexError({ code: "AccessDenied" });
    }
    const puzzle = await Cards.ensurePuzzle(ctx, {
      puzzleSelector: { kind: "day", day: args.day },
    });
    const memberships = await getMemberships(ctx, leaderboard);
    const stats = await Promise.all(
      memberships.map(async (m) => {
        const stats = await ctx.db
          .query("stats")
          .withIndex("UserAndPuzzle", (q) =>
            q.eq("userId", m.userId).eq("puzzleId", puzzle._id),
          )
          .unique();
        const user = await ctx.db.get(m.userId);
        const userName = user?.name ?? user?.email ?? "Unknown User";
        return {
          user: {
            _id: m.userId,
            name: userName,
          },
          timeToSolveMs:
            stats?.state.kind === "Solved" ? stats.state.timeElapsedMs : null,
        };
      }),
    );
    stats.sort((a, b) => {
      if (a.timeToSolveMs === null) {
        return 1;
      }
      if (b.timeToSolveMs === null) {
        return -1;
      }
      return a.timeToSolveMs - b.timeToSolveMs;
    });
    return {
      stats,
      leaderboard,
    };
  },
});
