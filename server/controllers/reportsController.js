import StoreInventory from "../models/StoreInventory.js";
import KitchenInventory from "../models/KitchenInventory.js";
import Purchase from "../models/Purchase.js";
import Transfer from "../models/Transfer.js";
import Consumption from "../models/Consumption.js";

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getDashboardSummary = async (req, res) => {
  try {
    const today = getToday();

    const [
      purchases,
      transfers,
      consumptions,
      storeInventory,
      kitchenInventory,
    ] = await Promise.all([
      Purchase.countDocuments({
        isDeleted: false,
      }),

      Transfer.countDocuments({
        isDeleted: false,
      }),

      Consumption.countDocuments(),

      StoreInventory.find({
        date: today,
      }),

      KitchenInventory.find({
        date: today,
      }),
    ]);

    const storeSummary = {
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
    };

    const kitchenSummary = {
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
    };

    res.status(200).json({
      success: true,

      summary: {
        purchases,
        transfers,
        consumptions,

        totalStoreItems: storeInventory.length,
        totalKitchenItems: kitchenInventory.length,

        store: storeSummary,
        kitchen: kitchenSummary,
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
    const today = getToday();

    const report = await StoreInventory.find({
      date: today,
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
    const today = getToday();

    const report = await KitchenInventory.find({
      date: today,
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
    const purchases = await Purchase.find({
      isDeleted: false,
    })
      .populate("item", "name unit")
      .populate("vendor", "name")
      .populate("createdBy", "name")
      .sort({
        purchaseDate: -1,
      });

    res.status(200).json({
      success: true,
      count: purchases.length,
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
    const transfers = await Transfer.find({
      isDeleted: false,
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
    const consumptions = await Consumption.find()
      .populate("item", "name unit")
      .populate("enteredBy", "name")
      .sort({
        consumptionDate: -1,
      });

    res.status(200).json({
      success: true,
      count: consumptions.length,
      consumptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};