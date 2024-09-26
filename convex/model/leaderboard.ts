import { ConvexError } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { ensureUser } from "./user";

export const getMemberships = async (
  ctx: QueryCtx,
  leaderboard: Doc<"leaderboard">,
) => {
  return await ctx.db
    .query("leaderboardMembers")
    .withIndex("leaderboard", (q) => q.eq("leaderboard", leaderboard._id))
    .collect();
};

export const getMembership = async (
  ctx: QueryCtx,
  leaderboard: Doc<"leaderboard">,
) => {
  const user = await ensureUser(ctx);
  const memberships = await ctx.db
    .query("leaderboardMembers")
    .withIndex("user", (q) => q.eq("userId", user._id))
    .collect();
  const membership =
    memberships.find((m) => m.leaderboard === leaderboard._id) ?? null;
  if (leaderboard.ownerId === user._id) {
    if (membership === null) {
      throw new Error(`Owner is not a member!: ${leaderboard._id}`);
    }
    return {
      membership,
      isOwner: true,
    };
  }
  return {
    membership,
    isOwner: false,
  };
};

export const ensureLeaderboard = async (
  ctx: QueryCtx,
  leaderboardId: Id<"leaderboard">,
) => {
  const leaderboard = await ctx.db.get(leaderboardId);
  if (leaderboard === null) {
    throw new ConvexError({ code: "NotFound" });
  }
  return leaderboard;
};
