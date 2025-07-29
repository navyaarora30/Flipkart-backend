require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Product = require("./models/Product");
const { router: authRoutes } = require("./auth");
const cartRoutes = require("./cart");
const productRoutes = require("./routes/product");

const app = express();

// ✅ CORS configuration (no credentials needed for token-based auth)
app.use(
  cors({
    origin: "https://flipkart-frontend-ruby.vercel.app", // your deployed frontend
  })
);

// ✅ Middleware
app.use(bodyParser.json());

// ✅ Routes
app.use("/api", authRoutes); // /api/auth/signup & /api/auth/login
app.use("/api", cartRoutes); // /api/cart/...
app.use("/api", productRoutes); // /api/products, /api/product/:id

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🛒 Flipkart Backend API is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
