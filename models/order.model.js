const mongoose = require('mongoose');

const orderSquema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderItems: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
      },
    ],
    date: { type: Date, required: true },
    total_price: { type: Number, required: true },
    status: {
      type:String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSquema);