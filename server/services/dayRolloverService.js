import Item from "../models/Item.js";
import Purchase from "../models/Purchase.js";
import StoreInventory from "../models/StoreInventory.js";
import KitchenInventory from "../models/KitchenInventory.js";
import SystemSettings from "../models/SystemSettings.js";

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

const startOfDay = (date) => {
  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);

  d.setDate(d.getDate() + days);

  return startOfDay(d);
};

/* -------------------------------------------------------------------------- */
/*                       Create System Settings If Missing                     */
/* -------------------------------------------------------------------------- */

export const initializeSystemSettings =
  async () => {
    let settings =
      await SystemSettings.findOne();

    if (!settings) {
      settings =
        await SystemSettings.create({
          currentBusinessDate:
            startOfDay(new Date()),
        });

      console.log(
        "System Settings Initialized."
      );
    }

    return settings;
  };

/* -------------------------------------------------------------------------- */
/*                           Manual Day Rollover                              */
/* -------------------------------------------------------------------------- */

export const performDayRollover = async (
  adminId
) => {
  const settings =
    await initializeSystemSettings();

  /* ------------------------- One Hour Protection ------------------------- */

  if (settings.lastRolloverAt) {
    const diff =
      Date.now() -
      settings.lastRolloverAt.getTime();

    if (diff < 60 * 60 * 1000) {
      throw new Error(
        "Day can only be changed once every hour."
      );
    }
  }

  const today =
    startOfDay(
      settings.currentBusinessDate
    );

  const tomorrow =
    addDays(today, 1);

  const items = await Item.find({
    isActive: true,
  });

  for (const item of items) {
    const todayStore =
      await StoreInventory.findOne({
        item: item._id,
        date: today,
      });

    const todayKitchen =
      await KitchenInventory.findOne({
        item: item._id,
        date: today,
      });

    await StoreInventory.findOneAndUpdate(
      {
        item: item._id,
        date: tomorrow,
      },
      {
        $setOnInsert: {
          opening:
            todayStore?.closing ?? 0,
          purchased: 0,
          transferred: 0,
          closing:
            todayStore?.closing ?? 0,
          isClosed: false,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    await KitchenInventory.findOneAndUpdate(
      {
        item: item._id,
        date: tomorrow,
      },
      {
        $setOnInsert: {
          opening:
            todayKitchen?.closing ?? 0,
          received: 0,
          consumed: 0,
          closing:
            todayKitchen?.closing ?? 0,
          isClosed: false,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (
      todayStore &&
      !todayStore.isClosed
    ) {
      todayStore.isClosed = true;

      await todayStore.save();
    }

    if (
      todayKitchen &&
      !todayKitchen.isClosed
    ) {
      todayKitchen.isClosed = true;

      await todayKitchen.save();
    }
  }

  settings.previousBusinessDate =
  settings.currentBusinessDate;

settings.currentBusinessDate =
  tomorrow;

settings.lastRolloverAt =
  new Date();

settings.lastRolloverBy =
  adminId;

  await settings.save();

  return {
  success: true,
  message:
    "Business day changed successfully.",

  businessDate: tomorrow,

  previousBusinessDate: today,
};
};

/* -------------------------------------------------------------------------- */
/*                           Current Business Date                            */
/* -------------------------------------------------------------------------- */

export const getCurrentBusinessDate =
  async () => {
    const settings =
      await initializeSystemSettings();

    return settings.currentBusinessDate;
  };

/* -------------------------------------------------------------------------- */
/*                           FIFO Calculation                                 */
/* -------------------------------------------------------------------------- */

export const calculateFIFOCost =
  async (
    itemId,
    consumedQuantity
  ) => {
    try {
      const purchases =
        await Purchase.find({
          item: itemId,
          isDeleted: false,
          remainingQuantity: {
            $gt: 0,
          },
        }).sort({
          purchaseDate: 1,
        });

      let remaining =
        consumedQuantity;

      let totalCost = 0;

      const breakdown = [];

      for (const purchase of purchases) {
        if (remaining <= 0)
          break;

        const quantityUsed =
          Math.min(
            remaining,
            purchase.remainingQuantity
          );

        const cost =
          quantityUsed *
          purchase.rate;

        totalCost += cost;

        breakdown.push({
          purchase: purchase._id,
          quantity: quantityUsed,
          rate: purchase.rate,
          cost,
        });

        remaining -= quantityUsed;
      }

      return {
        rate:
          consumedQuantity > 0
            ? totalCost /
              consumedQuantity
            : 0,
        cost: totalCost,
        breakdown,
      };
    } catch (error) {
      console.error(error);

      return {
        rate: 0,
        cost: 0,
        breakdown: [],
      };
    }
  };