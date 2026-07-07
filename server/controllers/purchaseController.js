import Purchase from "../models/Purchase.js";
import Item from "../models/Item.js";
import StoreInventory from "../models/StoreInventory.js";

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

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
      rate,
      totalAmount: quantity * rate,
      invoiceNo,
      purchaseDate,
      remarks,
      createdBy: req.user._id,
    });

    const today = getToday();

    let inventory = await StoreInventory.findOne({
      item,
      date: today,
    });

    if (!inventory) {
      inventory = await StoreInventory.create({
        item,
        date: today,
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
  console.error("========== PURCHASE ERROR ==========");
  console.error(error);
  console.error(error.stack);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

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

    const oldQuantity = purchase.quantity;

    Object.assign(purchase, req.body);

    purchase.totalAmount =
      purchase.quantity * purchase.rate;

    await purchase.save();

    const today = getToday();

    const inventory = await StoreInventory.findOne({
      item: purchase.item,
      date: today,
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

    purchase.isDeleted = true;

    await purchase.save();

    const today = getToday();

    const inventory = await StoreInventory.findOne({
      item: purchase.item,
      date: today,
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
      message: "Purchase archived successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};