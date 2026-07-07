import cron from "node-cron";
import { initializeTodayInventory } from "../services/dayScheduler.js";

/*
|--------------------------------------------------------------------------
| Initialize inventory when server starts
|--------------------------------------------------------------------------
|
| If the server was down at midnight, today's inventory will still be
| created automatically when the server comes back online.
|
*/

initializeTodayInventory();

/*
|--------------------------------------------------------------------------
| Run every hour
|--------------------------------------------------------------------------
|
| Instead of only running at 12:00 AM, we run every hour.
| The service is idempotent, so it will only create today's inventory
| if it does not already exist.
|
*/

cron.schedule("0 * * * *", async () => {
  console.log("Checking Daily Inventory...");

  await initializeTodayInventory();
});

console.log("Daily Inventory Scheduler Started");