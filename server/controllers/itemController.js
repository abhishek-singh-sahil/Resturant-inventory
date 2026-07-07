import Item from "../models/Item.js";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ isActive: true }).sort({
      name: 1,
    });

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

export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createItem = async (req, res) => {
  try {
    const {
      name,
      unit,
      lowStockLimit,
    } = req.body;

    if (!name || !unit) {
      return res.status(400).json({
        success: false,
        message: "Name and Unit are required.",
      });
    }

    const exists = await Item.findOne({
      name: name.trim(),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Item already exists.",
      });
    }

    const item = await Item.create({
      name: name.trim(),
      unit,
      lowStockLimit,
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully.",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateItem = async (req, res) => {
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

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

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
      message: "Item deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};