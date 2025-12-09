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
        _id: false, // Prevent Mongoose from auto-creating _id for sub-documents
        id: String, // ✅ Product ID
        name: String,
        quantity: Number,
        price: Number,
        category: String, // ✅ Added category
        image: String, // ✅ Added image URL
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
      enum: ["Pending", "Processing", "Completed", "Cancelled"], // ✅ Added Cancelled
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
