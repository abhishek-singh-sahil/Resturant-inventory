import Item from "../models/Item.js";
import Category from "../models/Category.js";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({
      isActive: true,
    })
      .populate("category", "name")
      .sort({
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
    const item = await Item.findById(
      req.params.id
    ).populate("category", "name");

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
      category,
      lowStockLimit,
    } = req.body;

    if (!name || !unit || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Unit, and Category are required.",
      });
    }

    // Verify category exists
    const categoryExists =
      await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
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
      category,
      lowStockLimit,
    });

    await item.populate("category", "name");

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
    if (req.body.category) {
      const categoryExists =
        await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name");

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