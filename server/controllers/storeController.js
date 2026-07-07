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

export const transferToKitchen = async (req, res) => {
  try {
    const { transfers } = req.body;

    if (!transfers || transfers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one item.",
      });
    }

    const today = getToday();

    for (const transfer of transfers) {
      const storeInventory =
        await StoreInventory.findOne({
          item: transfer.itemId,
          date: today,
        });

      if (!storeInventory) {
        return res.status(404).json({
          success: false,
          message: "Store inventory not found.",
        });
      }

      if (transfer.quantity > storeInventory.closing) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${storeInventory.item}`,
        });
      }

      await Transfer.create({
        item: transfer.itemId,
        quantity: transfer.quantity,
        remarks: transfer.remarks || "",
        transferredBy: req.user._id,
      });

      storeInventory.transferred += Number(
        transfer.quantity
      );

      await storeInventory.save();

      let kitchenInventory =
        await KitchenInventory.findOne({
          item: transfer.itemId,
          date: today,
        });

      if (!kitchenInventory) {
        kitchenInventory =
          await KitchenInventory.create({
            item: transfer.itemId,
            date: today,
          });
      }

      kitchenInventory.received += Number(
        transfer.quantity
      );

      await kitchenInventory.save();
    }

    res.status(201).json({
      success: true,
      message: "Transfer completed successfully.",
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