const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart"); // ✅ Import the model

// POST: Add item to cart
router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;
    if (!productId || !user) {
      return res
        .status(400)
        .json({ message: "ProductId and user is required" });
    }

    let cart = await Cart.findOne({ userId: user, status: "active" });
    if (!cart) {
      cart = new Cart({ userId: user, items: [], status: "active" });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
      });
    }

    cart.updatedAt = new Date();
    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error, item has not been added" });
  }
});

// GET: All carts
router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find({});
    res.status(200).json({
      success: true,
      count: carts.length,
      data: carts,
    });
  } catch (err) {
    console.log("Error fetching cart", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
      error: err.message,
    });
  }
});

// DELETE: Item from cart
router.delete("/cart/:userId/item/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ userId, status: "active" });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
