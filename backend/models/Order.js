const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    items: [
      {
        _id: false,   // <-- FIX: Prevent Mongoose from expecting ObjectId
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: Number,
    paymentMethod: {
      type: String,
      default: "None",
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Completed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
