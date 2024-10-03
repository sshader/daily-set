import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "scrape daily puzzle",
  { hourUTC: 8, minuteUTC: 0 },
  internal.scrape.scrapePuzzle,
);

export default crons;
