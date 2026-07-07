import Vendor from "../models/Vendor.js";

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor || !vendor.isActive) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createVendor = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      gstNumber,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Vendor name is required.",
      });
    }

    const existingVendor = await Vendor.findOne({
      name: name.trim(),
      isActive: true,
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists.",
      });
    }

    const vendor = await Vendor.create({
      name: name.trim(),
      phone,
      address,
      gstNumber,
    });

    res.status(201).json({
      success: true,
      message: "Vendor created successfully.",
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully.",
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    vendor.isActive = false;

    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};