import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ensureUser } from "./model/user";
import { ensureLeaderboard, getMembership } from "./model/leaderboard";

export const create = mutation({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    const password = crypto.randomUUID();
    const ownerName = user.name ?? user.email ?? "Unknown User";
    const leaderboardId = await ctx.db.insert("leaderboard", {
      ownerId: user._id,
      password,
      name: args.name ?? `${ownerName}'s Leaderboard`,
    });
    await ctx.db.insert("leaderboardMembers", {
      leaderboard: leaderboardId,
      userId: user._id,
    });
    return { leaderboardId, password };
  },
});

export const list = query({
  args: {},
  handler: async (ctx, _args) => {
    const user = await ensureUser(ctx);
    const leaderboardMembersips = await ctx.db
      .query("leaderboardMembers")
      .withIndex("user", (q) => q.eq("userId", user._id))
      .collect();
    const leaderboards = await Promise.all(
      leaderboardMembersips.map((m) => {
        return ctx.db.get(m.leaderboard);
      }),
    );
    return leaderboards.flatMap((leaderboard) => {
      return leaderboard === null ? [] : [leaderboard];
    });
  },
});

export const getInvite = query({
  args: {
    leaderboardId: v.id("leaderboard"),
  },
  handler: async (ctx, args) => {
    const leaderboard = await ensureLeaderboard(ctx, args.leaderboardId);
    const { membership } = await getMembership(ctx, leaderboard);
    if (membership === null) {
      throw new ConvexError({ code: "Unauthorized" });
    }
    return { password: leaderboard.password, _id: leaderboard._id };
  },
});

export const getName = query({
  args: {
    leaderboardId: v.id("leaderboard"),
  },
  handler: async (ctx, args) => {
    const leaderboard = await ensureLeaderboard(ctx, args.leaderboardId);
    return leaderboard.name;
  },
});

export const join = mutation({
  args: {
    leaderboardId: v.id("leaderboard"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    const leaderboard = await ensureLeaderboard(ctx, args.leaderboardId);
    const { membership } = await getMembership(ctx, leaderboard);
    if (membership !== null) {
      return;
    }
    if (leaderboard.password !== args.password) {
      return { reason: "IncorrectPassword" };
    }
    await ctx.db.insert("leaderboardMembers", {
      leaderboard: leaderboard._id,
      userId: user._id,
    });
  },
});

export const leave = mutation({
  args: {
    leaderboardId: v.id("leaderboard"),
  },
  handler: async (ctx, args) => {
    const leaderboard = await ensureLeaderboard(ctx, args.leaderboardId);
    const { membership, isOwner } = await getMembership(ctx, leaderboard);
    if (isOwner) {
      return { reason: "CannotLeaveIfOwner" };
    }
    if (membership !== null) {
      await ctx.db.delete(membership._id);
    }
  },
});

export const trash = mutation({
  args: {
    leaderboardId: v.id("leaderboard"),
  },
  handler: async (ctx, args) => {
    const leaderboard = await ensureLeaderboard(ctx, args.leaderboardId);
    const { isOwner } = await getMembership(ctx, leaderboard);
    if (!isOwner) {
      return { reason: "OnlyOwnerCanDelete" };
    }
    const memberships = await ctx.db
      .query("leaderboardMembers")
      .withIndex("leaderboard", (q) => q.eq("leaderboard", leaderboard._id))
      .collect();
    for (const m of memberships) {
      await ctx.db.delete(m._id);
    }
    await ctx.db.delete(leaderboard._id);
  },
});

export const setName = mutation({
  args: {
    leaderboardId: v.id("leaderboard"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const leaderboard = await ensureLeaderboard(ctx, args.leaderboardId);
    const { isOwner } = await getMembership(ctx, leaderboard);
    if (!isOwner) {
      return { reason: "OnlyOwnerCanRename" };
    }
    await ctx.db.patch(leaderboard._id, {
      name: args.name,
    });
  },
});
