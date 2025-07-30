const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ data: products }); // must wrap array in data object
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
