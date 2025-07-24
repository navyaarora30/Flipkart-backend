// models/Cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
  productId: Number,
  quantity: Number,
  user: Number,
  id: Number,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
