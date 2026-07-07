import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.001,
    },

    transferDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    transferredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

transferSchema.index({
  transferDate: 1,
  item: 1,
});

export default mongoose.model("Transfer", transferSchema);