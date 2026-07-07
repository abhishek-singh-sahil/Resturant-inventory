import Item from "../models/Item.js";

import StoreInventory from "../models/StoreInventory.js";
import KitchenInventory from "../models/KitchenInventory.js";

const startOfDay = (date = new Date()) => {
  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);

  d.setDate(d.getDate() + days);

  return startOfDay(d);
};

export const performDayRollover = async () => {
  try {
    const today = startOfDay();

    const yesterday = addDays(today, -1);

    const items = await Item.find({
      isActive: true,
    });

    for (const item of items) {
      let todayStore =
        await StoreInventory.findOne({
          item: item._id,
          date: today,
        });

      let todayKitchen =
        await KitchenInventory.findOne({
          item: item._id,
          date: today,
        });

      if (todayStore && todayKitchen) {
        continue;
      }

      const yesterdayStore =
        await StoreInventory.findOne({
          item: item._id,
          date: yesterday,
        });

      const yesterdayKitchen =
        await KitchenInventory.findOne({
          item: item._id,
          date: yesterday,
        });

      if (!todayStore) {
        todayStore =
          await StoreInventory.create({
            item: item._id,
            date: today,
            opening:
              yesterdayStore?.closing ?? 0,
            purchased: 0,
            transferred: 0,
          });
      }

      if (!todayKitchen) {
        todayKitchen =
          await KitchenInventory.create({
            item: item._id,
            date: today,
            opening:
              yesterdayKitchen?.closing ?? 0,
            received: 0,
            consumed: 0,
          });
      }

      if (
        yesterdayStore &&
        !yesterdayStore.isClosed
      ) {
        yesterdayStore.isClosed = true;

        await yesterdayStore.save();
      }

      if (
        yesterdayKitchen &&
        !yesterdayKitchen.isClosed
      ) {
        yesterdayKitchen.isClosed = true;

        await yesterdayKitchen.save();
      }
    }

    console.log(
      "Daily inventory rollover completed."
    );
  } catch (error) {
    console.error(
      "Day rollover failed:",
      error
    );
  }
};