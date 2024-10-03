import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import * as Cards from "./model/cards";
import { Doc } from "./_generated/dataModel";
import { getCardForDisplay } from "../common/cards";

export const startGame = mutation({
  args: {
    puzzleId: v.id("puzzles"),
  },
  handler: async (ctx, args) => {
    const { puzzle, user, stats } = await Cards.ensurePuzzleAndUser(ctx, {
      puzzleSelector: { kind: "id", id: args.puzzleId },
    });
    if (stats !== null) {
      console.warn("Game already started");
      return;
    }
    await ctx.db.insert("stats", {
      puzzleId: puzzle._id,
      userId: user._id,
      state: {
        kind: "InProgress",
        setsFound: [],
        timeElapsedMsBeforeStart: 0,
        startedAt: Date.now(),
      },
    });
  },
});

export const pauseGame = mutation({
  args: {
    puzzleId: v.id("puzzles"),
  },
  handler: async (ctx, args) => {
    const { puzzle, user, stats } = await Cards.ensurePuzzleAndUser(ctx, {
      puzzleSelector: { kind: "id", id: args.puzzleId },
    });
    if (stats === null || stats.state.kind !== "InProgress") {
      console.warn("Game not in progress");
      return;
    }
    await ctx.db.patch(stats._id, {
      state: {
        kind: "Paused",
        setsFound: stats.state.setsFound,
        timeElapsedMs:
          stats.state.timeElapsedMsBeforeStart +
          Date.now() -
          stats.state.startedAt,
      },
    });
  },
});

export const unpauseGame = mutation({
  args: {
    puzzleId: v.id("puzzles"),
  },
  handler: async (ctx, args) => {
    const { puzzle, user, stats } = await Cards.ensurePuzzleAndUser(ctx, {
      puzzleSelector: { kind: "id", id: args.puzzleId },
    });
    if (stats === null || stats.state.kind !== "Paused") {
      throw new ConvexError({
        code: "InvalidState",
        message: "Game not paused",
      });
    }
    await ctx.db.patch(stats._id, {
      state: {
        kind: "InProgress",
        setsFound: stats.state.setsFound,
        timeElapsedMsBeforeStart: stats.state.timeElapsedMs,
        startedAt: Date.now(),
      },
    });
  },
});

export const checkSet = mutation({
  args: {
    puzzleId: v.id("puzzles"),
    cards: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const { puzzle, user, stats } = await Cards.ensurePuzzleAndUser(ctx, {
      puzzleSelector: { kind: "id", id: args.puzzleId },
    });
    if (stats === null) {
      throw new ConvexError({
        code: "InvalidState",
        message: "Game not started",
      });
    }
    if (args.cards.length !== 3) {
      throw new ConvexError({
        code: "InvalidInput",
        message: "Must check three cards",
      });
    }
    return Cards.checkSet(ctx, {
      puzzle,
      user,
      stats,
      set: args.cards as [number, number, number],
    });
  },
});

export const loadGame = query({
  args: {
    day: v.optional(v.string()),
  },
  handler: async (ctx, { day }) => {
    let puzzle: Doc<"puzzles"> | null = null;
    if (day === undefined) {
      puzzle = await ctx.db
        .query("puzzles")
        .withIndex("day")
        .order("desc")
        .first();
    } else {
      puzzle = await ctx.db
        .query("puzzles")
        .withIndex("day", (q) => q.eq("day", day))
        .unique();
    }
    if (puzzle === null) {
      throw new ConvexError({
        code: "InvalidInput",
        message: "Invalid day",
      });
    }
    return {
      _id: puzzle._id,
      cards: puzzle.cards.map((c) => getCardForDisplay(c)),
    };
  },
});

export const loadStats = query({
  args: {
    day: v.optional(v.string()),
  },
  handler: async (ctx, { day }) => {
    const { puzzle, stats, user } = await Cards.ensurePuzzleAndUser(ctx, {
      puzzleSelector: { kind: "day", day },
    });
    return {
      stats,
      totalSets: puzzle.sets.length,
    };
  },
});
