import Item from "../models/Item.js";
import Purchase from "../models/Purchase.js";
import StoreInventory from "../models/StoreInventory.js";
import KitchenInventory from "../models/KitchenInventory.js";

// Get current date in IST timezone (UTC+5:30)
const getCurrentISTDate = () => {
  const now = new Date();
  // Add IST offset (5 hours 30 minutes = 19800000 ms)
  const istTime = new Date(
    now.getTime() + 5.5 * 60 * 60 * 1000
  );
  return new Date(
    istTime.getFullYear(),
    istTime.getMonth(),
    istTime.getDate(),
    0,
    0,
    0,
    0
  );
};

const startOfDay = (date = null) => {
  if (date === null) {
    return getCurrentISTDate();
  }
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

// Calculate FIFO cost for consumed quantity
export const calculateFIFOCost = async (
  itemId,
  consumedQuantity
) => {
  try {
    // Get all purchases for this item in FIFO order (oldest first)
    const purchases = await Purchase.find({
      item: itemId,
      isDeleted: false,
      remainingQuantity: { $gt: 0 },
    }).sort({ purchaseDate: 1 });

    let remaining = consumedQuantity;
    let totalCost = 0;
    const breakdown = [];

    for (const purchase of purchases) {
      if (remaining <= 0) break;

      // Use as much as we can from this purchase
      const quantityUsed = Math.min(
        remaining,
        purchase.remainingQuantity
      );

      const cost = quantityUsed * purchase.rate;
      totalCost += cost;

      breakdown.push({
        purchase: purchase._id,
        quantity: quantityUsed,
        rate: purchase.rate,
        cost: cost,
      });

      remaining -= quantityUsed;
    }

    // Calculate average rate for this consumption
    const avgRate =
      consumedQuantity > 0
        ? totalCost / consumedQuantity
        : 0;

    return {
      rate: avgRate,
      cost: totalCost,
      breakdown: breakdown,
    };
  } catch (error) {
    console.error(
      "FIFO calculation error:",
      error
    );
    return {
      rate: 0,
      cost: 0,
      breakdown: [],
    };
  }
};