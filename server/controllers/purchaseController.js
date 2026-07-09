import Purchase from "../models/Purchase.js";
import Item from "../models/Item.js";
import StoreInventory from "../models/StoreInventory.js";
import { getBusinessDate } from "../utils/businessDate.js";

/* -------------------------------------------------------------------------- */
/*                              CREATE PURCHASE                               */
/* -------------------------------------------------------------------------- */

export const createPurchase = async (req, res) => {
  try {
    const {
      item,
      vendor,
      quantity,
      rate,
      invoiceNo,
      purchaseDate,
      remarks,
    } = req.body;

    if (!item || !vendor || !quantity || !rate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const itemExists = await Item.findById(item);

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    const purchase = await Purchase.create({
      item,
      vendor,
      quantity,
      remainingQuantity: quantity,
      rate,
      totalAmount: quantity * rate,
      invoiceNo,
      purchaseDate,
      remarks,
      createdBy: req.user._id,
    });

    const businessDate = await getBusinessDate();

    let inventory = await StoreInventory.findOne({
      item,
      date: businessDate,
    });

    if (!inventory) {
      inventory = await StoreInventory.create({
        item,
        date: businessDate,
        opening: 0,
        purchased: 0,
        transferred: 0,
      });
    }

    inventory.purchased += Number(quantity);

    await inventory.save();

    res.status(201).json({
      success: true,
      message: "Purchase added successfully.",
      purchase,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              GET PURCHASES                                 */
/* -------------------------------------------------------------------------- */

export const getPurchases = async (req, res) => {
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

/* -------------------------------------------------------------------------- */
/*                              GET PURCHASE                                  */
/* -------------------------------------------------------------------------- */

export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(
      req.params.id
    )
      .populate("item", "name unit")
      .populate("vendor", "name")
      .populate("createdBy", "name");

    if (!purchase || purchase.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found.",
      });
    }

    res.status(200).json({
      success: true,
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                            UPDATE PURCHASE                                 */
/* -------------------------------------------------------------------------- */

export const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(
      req.params.id
    );

    if (!purchase || purchase.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found.",
      });
    }

    if (
      purchase.remainingQuantity <
      purchase.quantity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This purchase has already been consumed and cannot be edited.",
      });
    }

    const oldQuantity = purchase.quantity;

    Object.assign(purchase, req.body);

    purchase.totalAmount =
      purchase.quantity * purchase.rate;

    await purchase.save();

    const businessDate =
      await getBusinessDate();

    const inventory =
      await StoreInventory.findOne({
        item: purchase.item,
        date: businessDate,
      });

    if (inventory) {
      inventory.purchased =
        inventory.purchased -
        oldQuantity +
        purchase.quantity;

      await inventory.save();
    }

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully.",
      purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                            DELETE PURCHASE                                 */
/* -------------------------------------------------------------------------- */

export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(
      req.params.id
    );

    if (!purchase || purchase.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found.",
      });
    }

    if (
      purchase.remainingQuantity <
      purchase.quantity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This purchase has already been consumed and cannot be deleted.",
      });
    }

    purchase.isDeleted = true;

    await purchase.save();

    const businessDate =
      await getBusinessDate();

    const inventory =
      await StoreInventory.findOne({
        item: purchase.item,
        date: businessDate,
      });

    if (inventory) {
      inventory.purchased -= purchase.quantity;

      if (inventory.purchased < 0) {
        inventory.purchased = 0;
      }

      await inventory.save();
    }

    res.status(200).json({
      success: true,
      message:
        "Purchase archived successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};