import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx } from "../_generated/server";
import { ConvexError } from "convex/values";

export async function ensureUser(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError({ code: "unauthenticated" });
  }
  const user = await ctx.db.get(userId);
  if (user === null) {
    throw new ConvexError({ code: "unauthenticated" });
  }
  return user;
}
