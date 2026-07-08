import StoreInventory from "../models/StoreInventory.js";
import KitchenInventory from "../models/KitchenInventory.js";
import Purchase from "../models/Purchase.js";
import Transfer from "../models/Transfer.js";
import Consumption from "../models/Consumption.js";

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
    const { start, end } = getDateRange();

    const [
      purchases,
      transfers,
      consumptions,
      storeInventory,
      kitchenInventory,
    ] = await Promise.all([
      Purchase.countDocuments({
        isDeleted: false,
        purchaseDate: {
          $gte: start,
          $lt: end,
        },
      }),

      Transfer.countDocuments({
        isDeleted: false,
        transferDate: {
          $gte: start,
          $lt: end,
        },
      }),

      Consumption.countDocuments({
        consumptionDate: {
          $gte: start,
          $lt: end,
        },
      }),

      StoreInventory.find({
        date: start,
      }).populate("item", "name unit"),

      KitchenInventory.find({
        date: start,
      }).populate("item", "name unit"),
    ]);

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

    transferred: storeInventory.reduce(
      (sum, item) => sum + item.transferred,
      0
    ),

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

    consumed: kitchenInventory.reduce(
      (sum, item) => sum + item.consumed,
      0
    ),

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
export const getTransferReport = async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.date);

    const transfers = await Transfer.find({
      isDeleted: false,
      transferDate: {
        $gte: start,
        $lt: end,
      },
    })
      .populate("item", "name unit")
      .populate("transferredBy", "name")
      .sort({
        transferDate: -1,
      });

    res.status(200).json({
      success: true,
      count: transfers.length,
      transfers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConsumptionReport = async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.date);

    const consumptions = await Consumption.find({
      consumptionDate: {
        $gte: start,
        $lt: end,
      },
    })
      .populate("item", "name unit")
      .populate("enteredBy", "name")
      .sort({
        consumptionDate: -1,
      });

    let totalCost = 0;

    const report = consumptions.map((consumption) => {
  totalCost += consumption.cost;

  return {
    ...consumption.toObject(),
    rate: consumption.rate,
    cost: consumption.cost,
  };
});

    res.status(200).json({
      success: true,
      count: report.length,
      totalCost,
      consumptions: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};