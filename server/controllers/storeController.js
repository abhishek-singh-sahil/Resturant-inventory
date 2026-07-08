import StoreInventory from "../models/StoreInventory.js";
import KitchenInventory from "../models/KitchenInventory.js";
import Transfer from "../models/Transfer.js";
import Item from "../models/Item.js";

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getStoreItems = async (req, res) => {
  try {
    const today = getToday();

    const inventory = await StoreInventory.find({
      date: today,
    })
      .populate("item", "name unit lowStockLimit isActive")
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
        purchased: row.purchased,
        transferred: row.transferred,
        closing: row.closing,
        lowStockLimit: row.item.lowStockLimit,
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

export const updateStoreClosing = async (req, res) => {
  try {
    const { closing } = req.body;
    const itemId = req.params.id;

    const today = getToday();

    if (
      closing === undefined ||
      closing === null ||
      closing < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid closing value.",
      });
    }

    const storeInventory =
      await StoreInventory.findOne({
        item: itemId,
        date: today,
      });

    if (!storeInventory) {
      return res.status(404).json({
        success: false,
        message: "Store inventory not found.",
      });
    }

    const available =
      storeInventory.opening +
      storeInventory.purchased;

    if (closing > available) {
      return res.status(400).json({
        success: false,
        message:
          "Closing cannot exceed available stock.",
      });
    }

    // Calculate transferred = (opening + purchased) - closing
    const transferred =
      available - closing;

    storeInventory.closing = closing;
    storeInventory.transferred = transferred;

    await storeInventory.save();

    // Auto-create/update kitchen inventory with the transfer
    let kitchenInventory =
      await KitchenInventory.findOne({
        item: itemId,
        date: today,
      });

    if (!kitchenInventory) {
      kitchenInventory =
        await KitchenInventory.create({
          item: itemId,
          date: today,
          opening: 0,
          received: transferred,
          consumed: 0,
        });
    } else {
      // Update received quantity
      kitchenInventory.received = transferred;
      await kitchenInventory.save();
    }

    res.status(200).json({
      success: true,
      message:
        "Closing weight updated successfully. Transfer calculated automatically.",
      inventory: storeInventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStoreStock = async (req, res) => {
  try {
    const today = getToday();

    const inventory = await StoreInventory.find({
      date: today,
    }).populate("item", "name unit");

    res.status(200).json({
      success: true,
      stock: inventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateStoreItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item updated successfully.",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteStoreItem = async (req, res) => {
  try {
    const item = await Item.findById(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    item.isActive = false;

    await item.save();

    res.status(200).json({
      success: true,
      message: "Item archived successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};