import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    unit: {
      type: String,
      required: true,
      enum: [
        "Kg",
        "Gram",
        "Litre",
        "Ml",
        "Piece",
        "Packet",
        "Dozen",
      ],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    lowStockLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Item", itemSchema);