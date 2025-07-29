const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // ⬅️ This should return data
    res.json(products);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
