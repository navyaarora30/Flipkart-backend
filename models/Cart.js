const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  status: {
    type: String,
    default: "active",
  },
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
