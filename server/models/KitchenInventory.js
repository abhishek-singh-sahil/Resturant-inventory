import mongoose from "mongoose";

const kitchenInventorySchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    opening: {
      type: Number,
      default: 0,
      min: 0,
    },

    received: {
      type: Number,
      default: 0,
      min: 0,
    },

    consumed: {
      type: Number,
      default: 0,
      min: 0,
    },

    closing: {
      type: Number,
      default: 0,
      min: 0,
    },

    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// One record per item per day
kitchenInventorySchema.index(
  {
    item: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

// Automatically calculate closing stock
kitchenInventorySchema.pre("save", function () {
  this.closing =
    this.opening +
    this.received -
    this.consumed;
});

export default mongoose.model(
  "KitchenInventory",
  kitchenInventorySchema
);