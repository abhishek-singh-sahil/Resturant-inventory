import KitchenInventory from "../models/KitchenInventory.js";
import Consumption from "../models/Consumption.js";
import Purchase from "../models/Purchase.js";
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getKitchenItems = async (req, res) => {
  try {
    const today = getToday();

    const inventory = await KitchenInventory.find({
      date: today,
    })
      .populate("item", "name unit isActive")
      .sort({
        "item.name": 1,
      });

    const items = inventory
      .filter((row) => row.item?.isActive)
      .map((row) => ({
        _id: row.item._id,
        name: row.item.name,
        unit: row.item.unit,
        opening: row.opening,
        received: row.received,
        consumed: row.consumed,
        closing: row.closing,
      }));

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const saveConsumption = async (req, res) => {
  try {
    const { consumptions } = req.body;

    if (!consumptions || consumptions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No consumption data received.",
      });
    }

    const today = getToday();

    for (const data of consumptions) {
      const inventory = await KitchenInventory.findOne({
        item: data.itemId,
        date: today,
      });

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: "Kitchen inventory not found.",
        });
      }

      if (Number(data.quantity) > inventory.closing) {
        return res.status(400).json({
          success: false,
          message: `${inventory.item} does not have sufficient stock.`,
        });
      }
      let remaining = Number(data.quantity);

let purchaseBreakdown = [];

let totalCost = 0;

const purchases = await Purchase.find({
  item: data.itemId,
  isDeleted: false,
  remainingQuantity: { $gt: 0 },
}).sort({
  purchaseDate: 1,
});
const totalAvailable = purchases.reduce(
  (sum, purchase) => sum + purchase.remainingQuantity,
  0
);

if (totalAvailable < Number(data.quantity)) {
  return res.status(400).json({
    success: false,
    message:
      "Purchase history is insufficient for FIFO calculation.",
  });
}

for (const purchase of purchases) {
  if (remaining <= 0) break;

  const usedQuantity = Math.min(
    remaining,
    purchase.remainingQuantity
  );

  purchase.remainingQuantity -= usedQuantity;

  const cost = usedQuantity * purchase.rate;

  totalCost += cost;

  purchaseBreakdown.push({
    purchase: purchase._id,
    quantity: usedQuantity,
    rate: purchase.rate,
    cost,
  });

  remaining -= usedQuantity;

  await purchase.save();
}
if (remaining > 0) {
  return res.status(400).json({
    success: false,
    message:
      "Purchase history is insufficient for FIFO calculation.",
  });
}

const averageRate =
  totalCost / Number(data.quantity);

await Consumption.create({
  item: data.itemId,
  quantity: Number(data.quantity),
  rate: averageRate,
  cost: totalCost,
  purchaseBreakdown,
  remarks: data.remarks || "",
  enteredBy: req.user._id,
});

      inventory.consumed += Number(data.quantity);

      await inventory.save();
    }

    res.status(201).json({
      success: true,
      message: "Consumption saved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTodayConsumption = async (req, res) => {
  try {
    const today = getToday();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const consumption = await Consumption.find({
      consumptionDate: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .populate("item", "name unit")
      .populate("enteredBy", "name")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: consumption.length,
      consumption,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};