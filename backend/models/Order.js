const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true
    },
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    items: [OrderItemSchema],
    totalAmount: Number,
    paymentMethod: {
      type: String,
      default: "Cash On Delivery",
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },
    deliveryDate: Date
  },
  { timestamps: true }
);

// Generate Custom Order Number Before Save
OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments() + 1;
    this.orderNumber = `EG-${new Date().getFullYear()}-${String(count).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
