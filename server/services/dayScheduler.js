import cron from "node-cron";
import { performDayRollover } from "./dayRolloverService.js";

// Perform rollover on startup
await performDayRollover();

// Schedule for IST timezone (UTC+5:30)
// "0 0 * * *" means at 00:00 every day
// The timezone parameter tells node-cron to use IST
cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      await performDayRollover();
      console.log(
        "Daily inventory rollover completed (IST: 00:00)."
      );
    } catch (err) {
      console.error("Day rollover error:", err);
    }
  },
  {
    timezone: "Asia/Kolkata", // IST timezone
  }
);

// Also run every hour as a backup to ensure no missed rollover
cron.schedule(
  "0 * * * *",
  async () => {
    try {
      await performDayRollover();
      console.log(
        "Hourly inventory check completed."
      );
    } catch (err) {
      console.error(
        "Hourly check error:",
        err
      );
    }
  },
  {
    timezone: "Asia/Kolkata", // IST timezone
  }
);

console.log(
  "Daily Inventory Scheduler Started (IST Timezone)"
);