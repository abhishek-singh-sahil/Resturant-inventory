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