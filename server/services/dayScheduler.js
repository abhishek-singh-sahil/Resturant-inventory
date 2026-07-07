import cron from "node-cron";
import { performDayRollover } from "./dayRolloverService.js";

await performDayRollover();

cron.schedule("0 * * * *", async () => {
  try {
    await performDayRollover();
    console.log("Hourly inventory check completed.");
  } catch (err) {
    console.error(err);
  }
});

console.log("Daily Inventory Scheduler Started");