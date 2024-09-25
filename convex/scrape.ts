import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { parsePuzzle } from "./model/parse";
import * as Cards from "./model/cards";
import { internal } from "./_generated/api";

export const scrapePuzzle = internalAction(async (ctx) => {
  const puzzleResponse = await fetch("https://www.setgame.com/set/puzzle");
  const puzzleHtml = await puzzleResponse.text();
  const { date, cards } = parsePuzzle(puzzleHtml);
  await ctx.runMutation(internal.scrape.addPuzzle, { date, cards });
});

export const addPuzzle = internalMutation({
  args: {
    date: v.string(),
    cards: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    await Cards.importPuzzle(ctx, args.date, args.cards);
  },
});
