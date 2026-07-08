import StoreInventory from "../models/StoreInventory.js";
import KitchenInventory from "../models/KitchenInventory.js";
import Purchase from "../models/Purchase.js";
import Item from "../models/Item.js";
import { calculateFIFOCost } from "../services/dayRolloverService.js";

const getDateRange = (dateString) => {
  const date = dateString
    ? new Date(dateString)
    : new Date();

  date.setHours(0, 0, 0, 0);

  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  return {
    start: date,
    end: nextDay,
  };
};

export const getDashboardSummary = async (req, res) => {
  try {
    const { start } = getDateRange();

    const storeInventory =
      await StoreInventory.find({
        date: start,
      }).populate(
        "item",
        "name unit category"
      );

    const kitchenInventory =
      await KitchenInventory.find({
        date: start,
      }).populate(
        "item",
        "name unit category"
      );

    // Calculate transfers from store
    const transfers = storeInventory.reduce(
      (sum, item) => sum + item.transferred,
      0
    );

    // Calculate consumed from kitchen
    const consumptions = kitchenInventory.reduce(
      (sum, item) => sum + item.consumed,
      0
    );

    const purchases = await Purchase.countDocuments(
      {
        isDeleted: false,
        purchaseDate: {
          $gte: start,
          $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000),
        },
      }
    );

    res.status(200).json({
      success: true,
      summary: {
        purchases,
        transfers,
        consumptions,

        store: {
          opening: storeInventory.reduce(
            (sum, item) => sum + item.opening,
            0
          ),

          purchased: storeInventory.reduce(
            (sum, item) => sum + item.purchased,
            0
          ),

          transferred: transfers,

          closing: storeInventory.reduce(
            (sum, item) => sum + item.closing,
            0
          ),
        },

        kitchen: {
          opening: kitchenInventory.reduce(
            (sum, item) => sum + item.opening,
            0
          ),

          received: kitchenInventory.reduce(
            (sum, item) => sum + item.received,
            0
          ),

          consumed: consumptions,

          closing: kitchenInventory.reduce(
            (sum, item) => sum + item.closing,
            0
          ),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStoreReport = async (req, res) => {
  try {
    const { start } = getDateRange(req.query.date);

    const report =
      await StoreInventory.find({
        date: start,
      })
        .populate("item", "name unit")
        .sort({
          "item.name": 1,
        });

    res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getKitchenReport = async (req, res) => {
  try {
    const { start } = getDateRange(req.query.date);

    const report =
      await KitchenInventory.find({
        date: start,
      })
        .populate("item", "name unit")
        .sort({
          "item.name": 1,
        });

    res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPurchaseReport = async (req, res) => {
  try {
    const { start, end } =
      getDateRange(req.query.date);

    const purchases =
      await Purchase.find({
        isDeleted: false,
        purchaseDate: {
          $gte: start,
          $lt: end,
        },
      })
        .populate("item", "name unit")
        .populate("vendor", "name")
        .populate("createdBy", "name")
        .sort({
          purchaseDate: -1,
        });

    const totalQuantity =
      purchases.reduce(
        (sum, purchase) =>
          sum + purchase.quantity,
        0
      );

    const totalAmount =
      purchases.reduce(
        (sum, purchase) =>
          sum + purchase.totalAmount,
        0
      );

    res.status(200).json({
      success: true,
      count: purchases.length,
      totalQuantity,
      totalAmount,
      purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getTransferReport = async (
  req,
  res
) => {
  try {
    const { start } = getDateRange(req.query.date);

    const transfers =
      await StoreInventory.find({
        date: start,
        transferred: { $gt: 0 },
      })
        .populate("item", "name unit category")
        .sort({
          "item.name": 1,
        });

    const totalTransferred =
      transfers.reduce(
        (sum, item) => sum + item.transferred,
        0
      );

    res.status(200).json({
      success: true,
      count: transfers.length,
      totalTransferred,
      transfers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConsumptionReport = async (
  req,
  res
) => {
  try {
    const { start } = getDateRange(req.query.date);

    const consumptions =
      await KitchenInventory.find({
        date: start,
        consumed: { $gt: 0 },
      })
        .populate("item", "name unit category")
        .sort({
          "item.name": 1,
        });

    // Calculate FIFO cost for each consumption
    const withFIFO = await Promise.all(
      consumptions.map(async (consumption) => {
        const fifoData = await calculateFIFOCost(
          consumption.item._id,
          consumption.consumed
        );

        return {
          ...consumption.toObject(),
          rate: fifoData.rate,
          cost: fifoData.cost,
          breakdown: fifoData.breakdown,
        };
      })
    );

    const totalConsumed = withFIFO.reduce(
      (sum, item) => sum + item.consumed,
      0
    );

    const totalCost = withFIFO.reduce(
      (sum, item) => sum + item.cost,
      0
    );

    res.status(200).json({
      success: true,
      count: withFIFO.length,
      totalConsumed,
      totalCost,
      consumptions: withFIFO,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPurchaseByCategory = async (
  req,
  res
) => {
  try {
    const { start, end } = getDateRange(
      req.query.date
    );

    const purchases =
      await Purchase.find({
        isDeleted: false,
        purchaseDate: {
          $gte: start,
          $lt: end,
        },
      })
        .populate({
          path: "item",
          select: "name unit category",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .populate("vendor", "name")
        .sort({
          purchaseDate: -1,
        });

    // Group by category
    const groupedByCategory = {};

    purchases.forEach((purchase) => {
      const categoryName =
        purchase.item?.category?.name ||
        "Uncategorized";

      if (!groupedByCategory[categoryName]) {
        groupedByCategory[categoryName] = {
          category: categoryName,
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        };
      }

      groupedByCategory[categoryName].items.push(
        purchase
      );
      groupedByCategory[categoryName].totalQuantity +=
        purchase.quantity;
      groupedByCategory[categoryName].totalAmount +=
        purchase.totalAmount;
    });

    const report = Object.values(
      groupedByCategory
    );

    res.status(200).json({
      success: true,
      count: report.length,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConsumptionByCategory = async (
  req,
  res
) => {
  try {
    const { start } = getDateRange(req.query.date);

    const consumptions =
      await KitchenInventory.find({
        date: start,
        consumed: { $gt: 0 },
      })
        .populate({
          path: "item",
          select: "name unit category",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .sort({
          "item.name": 1,
        });

    // Calculate FIFO cost for each consumption
    const withFIFO = await Promise.all(
      consumptions.map(async (consumption) => {
        const fifoData = await calculateFIFOCost(
          consumption.item._id,
          consumption.consumed
        );

        return {
          ...consumption.toObject(),
          rate: fifoData.rate,
          cost: fifoData.cost,
          breakdown: fifoData.breakdown,
        };
      })
    );

    // Group by category with FIFO cost aggregation
    const groupedByCategory = {};

    withFIFO.forEach((consumption) => {
      const categoryName =
        consumption.item?.category?.name ||
        "Uncategorized";

      if (!groupedByCategory[categoryName]) {
        groupedByCategory[categoryName] = {
          category: categoryName,
          items: [],
          totalConsumed: 0,
          totalCost: 0,
        };
      }

      groupedByCategory[categoryName].items.push(
        consumption
      );
      groupedByCategory[categoryName].totalConsumed +=
        consumption.consumed;
      groupedByCategory[categoryName].totalCost +=
        consumption.cost;
    });

    const report = Object.values(
      groupedByCategory
    );

    const totalConsumed = withFIFO.reduce(
      (sum, item) => sum + item.consumed,
      0
    );

    const totalCost = withFIFO.reduce(
      (sum, item) => sum + item.cost,
      0
    );

    res.status(200).json({
      success: true,
      count: report.length,
      totalConsumed,
      totalCost,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};