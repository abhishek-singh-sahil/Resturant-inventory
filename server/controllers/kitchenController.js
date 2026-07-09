import KitchenInventory from "../models/KitchenInventory.js";
import Consumption from "../models/Consumption.js";
import Purchase from "../models/Purchase.js";
import { getBusinessDate } from "../utils/businessDate.js";

/* -------------------------------------------------------------------------- */
/*                            GET KITCHEN ITEMS                               */
/* -------------------------------------------------------------------------- */

export const getKitchenItems = async (req, res) => {
  try {
    const businessDate = await getBusinessDate();

    const inventory = await KitchenInventory.find({
      date: businessDate,
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

/* -------------------------------------------------------------------------- */
/*                        UPDATE KITCHEN CLOSING                              */
/* -------------------------------------------------------------------------- */

export const updateKitchenClosing = async (
  req,
  res
) => {
  try {
    const { closing } = req.body;

    const itemId = req.params.id;

    const businessDate =
      await getBusinessDate();

    if (
      closing === undefined ||
      closing === null ||
      closing < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid closing value.",
      });
    }

    const kitchenInventory =
      await KitchenInventory.findOne({
        item: itemId,
        date: businessDate,
      });

    if (!kitchenInventory) {
      return res.status(404).json({
        success: false,
        message:
          "Kitchen inventory not found.",
      });
    }

    const available =
      kitchenInventory.opening +
      kitchenInventory.received;

    if (closing > available) {
      return res.status(400).json({
        success: false,
        message:
          "Closing cannot exceed available stock.",
      });
    }

    const consumed =
      available - closing;

    kitchenInventory.closing =
      closing;

    kitchenInventory.consumed =
      consumed;

    await kitchenInventory.save();

    res.status(200).json({
      success: true,
      message:
        "Closing weight updated successfully.",
      inventory: kitchenInventory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};