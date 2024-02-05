const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    address: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      default: "Pending",
    },
  }
);

module.exports = mongoose.model("Order", orderSchema);