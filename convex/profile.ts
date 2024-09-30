import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ensureUser } from "./model/user";

export const setName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    await ctx.db.patch(user._id, {
      name: args.name,
    });
  },
});

export const setColors = mutation({
  args: {
    colorPalette: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    await ctx.db.patch(user._id, {
      colorPalette: args.colorPalette,
    });
  },
});
