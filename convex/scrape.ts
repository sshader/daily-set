import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { parsePuzzle } from "./model/parse";
import * as Cards from "./model/cards";
import { internal } from "./_generated/api";

export const scrapePuzzle = internalAction(async (ctx) => {
  let date: string | undefined;
  let cards: Array<number> | undefined;
  try {
    // This site's SSL expired and the site also might just be down so...
    const puzzleResponse = await fetch("http://www.setgame.com/set/puzzle");
    const puzzleHtml = await puzzleResponse.text();
    const { date: dateStr, cards: cardsArr } = parsePuzzle(puzzleHtml);
    date = dateStr;
    cards = cardsArr;
  } catch (e) {
    console.error("Failed to scrape puzzle, generating random puzzle instead");
    cards = Cards.generatePuzzle();
    date = new Date().toISOString().split("T")[0];
  }
  if (date && cards) {
    await ctx.runMutation(internal.scrape.addPuzzle, { date, cards });
  }
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
