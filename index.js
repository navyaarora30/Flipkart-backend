require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

console.log("MONGO_URL:", process.env.MONGO_URL);

const Product = require("./models/Product");
const { router: authRoutes } = require("./auth");
const cartRoutes = require("./cart");
const productRoutes = require("./routes/product");

const app = express();

// ✅ CORS configuration for all Vercel frontend deployments
const allowedOrigins = [
  "https://flipkart-frontend-ruby.vercel.app",
  "https://flipkart-frontend-git-main-navya-aroras-projects.vercel.app",
  "https://flipkart-frontend-navya-aroras-projects.vercel.app",
  "https://flipkart-frontend-533ecvoc-navya-aroras-projects.vercel.app",
  "http://localhost:5173",
  "https://hoppscotch.io",
  "chrome-extension://amknoiejhlmhancpahfcfcfhllgkpbld", // ✅ Hoppscotch extension
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
  })
);

// ✅ Middleware
app.use(bodyParser.json());

// ✅ Routes
app.use("/api", authRoutes); // /api/auth/signup, /api/auth/login
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

// ✅ Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
