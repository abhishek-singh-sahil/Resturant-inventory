import mongoose from "mongoose";

const consumptionSchema = new mongoose.Schema(
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

    // Actual FIFO rate used for this consumption
    rate: {
      type: Number,
      required: true,
      default: 0,
    },

    // Actual FIFO cost
    cost: {
      type: Number,
      required: true,
      default: 0,
    },

    // FIFO purchase history
    purchaseBreakdown: [
      {
        purchase: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Purchase",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        rate: {
          type: Number,
          required: true,
        },

        cost: {
          type: Number,
          required: true,
        },
      },
    ],

    consumptionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

consumptionSchema.index({
  item: 1,
  consumptionDate: 1,
});

export default mongoose.model(
  "Consumption",
  consumptionSchema
);