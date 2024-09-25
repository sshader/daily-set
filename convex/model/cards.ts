import { MutationCtx, QueryCtx } from "../_generated/server";
import "lodash.combinations";
import _ from "lodash";
import { Doc, Id } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

export type Card = {
  color: "Red" | "Green" | "Purple";
  fill: "Solid" | "Open" | "Striped";
  shape: "Oval" | "Diamond" | "Squiggle";
  count: 1 | 2 | 3;
  cardNumber: number;
};

const isSet = (
  cardNumber1: number,
  cardNumber2: number,
  cardNumber3: number,
) => {
  let num1 = cardNumber1;
  let num2 = cardNumber2;
  let num3 = cardNumber3;
  // count
  if ((num1 + num2 + num3) % 3 !== 0) {
    return false;
  }
  num1 = (num1 - (num1 % 3)) / 3;
  num2 = (num2 - (num2 % 3)) / 3;
  num3 = (num3 - (num3 % 3)) / 3;
  // color
  if ((num1 + num2 + num3) % 3 !== 0) {
    return false;
  }
  num1 = (num1 - (num1 % 3)) / 3;
  num2 = (num2 - (num2 % 3)) / 3;
  num3 = (num3 - (num3 % 3)) / 3;
  // shape
  if ((num1 + num2 + num3) % 3 !== 0) {
    return false;
  }
  num1 = (num1 - (num1 % 3)) / 3;
  num2 = (num2 - (num2 % 3)) / 3;
  num3 = (num3 - (num3 % 3)) / 3;
  // fill
  if ((num1 + num2 + num3) % 3 !== 0) {
    return false;
  }
  return true;
};

export const importPuzzle = async (
  ctx: MutationCtx,
  day: string,
  cards: Array<number>,
) => {
  const existing = await ctx.db
    .query("puzzles")
    .withIndex("day", (q) => q.eq("day", day))
    .unique();
  if (existing !== null) {
    return;
  }
  const allSets: Array<[number, number, number]> = [];
  for (let idx1 = 0; idx1 < cards.length - 2; idx1 += 1) {
    for (let idx2 = idx1 + 1; idx2 < cards.length - 1; idx2 += 1) {
      for (let idx3 = idx2 + 1; idx3 < cards.length; idx3 += 1) {
        if (isSet(cards[idx1], cards[idx2], cards[idx3])) {
          allSets.push([cards[idx1], cards[idx2], cards[idx3]]);
        }
      }
    }
  }
  await ctx.db.insert("puzzles", {
    cards,
    sets: allSets,
    day,
  });
};

export const checkSet = async (
  ctx: MutationCtx,
  args: {
    puzzle: Doc<"puzzles">;
    user: Doc<"users">;
    stats: Doc<"stats">;
    set: [number, number, number];
  },
): Promise<null | { result: "NotASet" | "AlreadyFound" }> => {
  const { puzzle, user, stats, set } = args;
  if (stats.state.kind !== "InProgress") {
    console.warn(
      `Selecting set when game not in progress? User: ${user._id}, Puzzle: ${puzzle._id}, State: ${stats.state.kind}`,
    );
    return null;
  }
  const sortedSet = [...args.set].sort();
  if (
    stats.state.setsFound.find(
      (s) => JSON.stringify([...s].sort()) === JSON.stringify(sortedSet),
    ) !== undefined
  ) {
    return { result: "AlreadyFound" };
  }
  if (
    puzzle.sets.find((s) => JSON.stringify(s) === JSON.stringify(sortedSet)) !==
    undefined
  ) {
    if (puzzle.sets.length - 1 === stats.state.setsFound.length) {
      await ctx.db.patch(stats._id, {
        state: {
          kind: "Solved",
          timeElapsedMs:
            stats.state.timeElapsedMsBeforeStart +
            Date.now() -
            stats.state.startedAt,
          setsFound: [...stats.state.setsFound, args.set],
        },
      });
      return null;
    }
    await ctx.db.patch(stats._id, {
      state: {
        kind: "InProgress",
        timeElapsedMsBeforeStart: stats.state.timeElapsedMsBeforeStart,
        startedAt: stats.state.startedAt,
        setsFound: [...stats.state.setsFound, args.set],
      },
    });
    return null;
  }
  return { result: "NotASet" };
};

export const getCardForDisplay = (cardNumber: number): Card => {
  let num = cardNumber - 1;
  const countBit = num % 3;
  num = (num - countBit) / 3;
  const colorBit = num % 3;
  num = (num - colorBit) / 3;
  const shapeBit = num % 3;
  num = (num - shapeBit) / 3;
  const fillBit = num % 3;
  return {
    count: countBit === 0 ? 1 : countBit === 1 ? 2 : 3,
    color: colorBit === 0 ? "Red" : colorBit === 1 ? "Purple" : "Green",
    shape: shapeBit === 0 ? "Squiggle" : shapeBit === 1 ? "Diamond" : "Oval",
    fill: fillBit === 0 ? "Solid" : fillBit === 1 ? "Striped" : "Open",
    cardNumber,
  };
};

export const ensurePuzzleAndUser = async (
  ctx: QueryCtx,
  args: {
    puzzleSelector:
      | { kind: "id"; id: Id<"puzzles"> }
      | { kind: "day"; day?: string };
  },
) => {
  let puzzle: Doc<"puzzles"> | null = null;
  switch (args.puzzleSelector.kind) {
    case "id":
      puzzle = await ctx.db.get(args.puzzleSelector.id);
      break;
    case "day": {
      const day = args.puzzleSelector.day;
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
      break;
    }
  }
  if (puzzle === null) {
    throw new Error("No puzzle found");
  }
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError({ code: "unauthenticated" });
  }
  const user = await ctx.db.get(userId);
  if (user === null) {
    throw new Error("No user found");
  }
  const stats = await ctx.db
    .query("stats")
    .withIndex("UserAndPuzzle", (q) =>
      q.eq("userId", userId).eq("puzzleId", puzzle._id),
    )
    .unique();
  return { puzzle, user, stats };
};
