/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as account from "../account.js";
import type * as checkins from "../checkins.js";
import type * as dashboard from "../dashboard.js";
import type * as events from "../events.js";
import type * as importLessons from "../importLessons.js";
import type * as journal from "../journal.js";
import type * as lessonUpsert from "../lessonUpsert.js";
import type * as lessons from "../lessons.js";
import type * as lifemap from "../lifemap.js";
import type * as reflections from "../reflections.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  account: typeof account;
  checkins: typeof checkins;
  dashboard: typeof dashboard;
  events: typeof events;
  importLessons: typeof importLessons;
  journal: typeof journal;
  lessonUpsert: typeof lessonUpsert;
  lessons: typeof lessons;
  lifemap: typeof lifemap;
  reflections: typeof reflections;
  seed: typeof seed;
  users: typeof users;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
