import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    currentBusinessDate: {
      type: Date,
      required: true,
    },

    lastRolloverAt: {
      type: Date,
      default: null,
    },

    lastRolloverBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SystemSettings",
  systemSettingsSchema
);