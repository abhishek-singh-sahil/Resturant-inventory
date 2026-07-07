import cron from "node-cron";

import { performDayRollover } from "./dayRolloverService.js";

/*
|--------------------------------------------------------------------------
| Run once whenever server starts
|--------------------------------------------------------------------------
|
| If the server was down during midnight,
| today's inventory will still be created correctly.
|
*/

await performDayRollover();

/*
|--------------------------------------------------------------------------
| Check every hour
|--------------------------------------------------------------------------
|
| We intentionally do NOT run only at 12 AM.
|
| If the server is restarted at 8:30 AM,
| the rollover will still happen automatically.
|
| Since performDayRollover() is idempotent,
| running it multiple times is completely safe.
|
*/

cron.schedule("0 * * * *", async () => {
  console.log("Running Daily Inventory Scheduler...");

  await performDayRollover();
});

console.log("Daily Inventory Scheduler Started");