import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
export default defineSchema({
  ...authTables,
  puzzles: defineTable({
    // Cards are denoted by a number corresponding to their position in the unsorted deck
    cards: v.array(v.number()),
    // Array of triples of card numbers in sorted order
    sets: v.array(v.array(v.number())),
    // ISO string for the day
    day: v.string(),
  }).index("day", ["day"]),
  stats: defineTable({
    puzzleId: v.id("puzzles"),
    userId: v.id("users"),
    state: v.union(
      v.object({
        kind: v.literal("NotStarted"),
      }),
      v.object({
        kind: v.literal("InProgress"),
        setsFound: v.array(v.array(v.number())),
        timeElapsedMsBeforeStart: v.number(),
        startedAt: v.number(),
      }),
      v.object({
        kind: v.literal("Paused"),
        setsFound: v.array(v.array(v.number())),
        timeElapsedMs: v.number(),
      }),
      v.object({
        kind: v.literal("Solved"),
        setsFound: v.array(v.array(v.number())),
        timeElapsedMs: v.number(),
      }),
    ),
  }).index("UserAndPuzzle", ["userId", "puzzleId"]),
  leaderboard: defineTable({
    ownerId: v.id("users"),
    password: v.string(),
    name: v.string(),
  }),
  leaderboardMembers: defineTable({
    userId: v.id("users"),
    leaderboard: v.id("leaderboard"),
  })
    .index("user", ["userId"])
    .index("leaderboard", ["leaderboard"]),
});
