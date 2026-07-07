import mongoose from "mongoose";

const storeInventorySchema = new mongoose.Schema(
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

    purchased: {
      type: Number,
      default: 0,
      min: 0,
    },

    transferred: {
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
storeInventorySchema.index(
  {
    item: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

// Automatically calculate closing stock
storeInventorySchema.pre("save", function () {
  this.closing =
    this.opening +
    this.purchased -
    this.transferred;
});

export default mongoose.model(
  "StoreInventory",
  storeInventorySchema
);