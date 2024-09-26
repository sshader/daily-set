/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as leaderboard from "../leaderboard.js";
import type * as leaderboardStats from "../leaderboardStats.js";
import type * as model_cards from "../model/cards.js";
import type * as model_leaderboard from "../model/leaderboard.js";
import type * as model_parse from "../model/parse.js";
import type * as model_user from "../model/user.js";
import type * as play from "../play.js";
import type * as scrape from "../scrape.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  leaderboard: typeof leaderboard;
  leaderboardStats: typeof leaderboardStats;
  "model/cards": typeof model_cards;
  "model/leaderboard": typeof model_leaderboard;
  "model/parse": typeof model_parse;
  "model/user": typeof model_user;
  play: typeof play;
  scrape: typeof scrape;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
