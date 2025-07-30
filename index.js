require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
console.log("MONGO_URL:", process.env.MONGO_URL);

const { router: authRoutes } = require("./auth");
const cartRoutes = require("./cart");
const productRoutes = require("./routes/product");

const allowedOrigins = [
  "https://flipkart-frontend-ruby.vercel.app",
  "https://flipkart-frontend-git-main-navya-aroras-projects.vercel.app",
  "https://flipkart-frontend-navya-aroras-projects.vercel.app",
  "https://flipkart-frontend-533ecvoc-navya-aroras-projects.vercel.app",
  "http://localhost:5173",
  "https://hoppscotch.io",
  "chrome-extension://amknoiejhlmhancpahfcfcfhllgkpbld", // Hoppscotch extension
];

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error(`Not allowed ${origin}`)),
  })
);
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api", cartRoutes);
app.use("/api", productRoutes);

app.get("/debug", (_req, res) =>
  res.json({ message: "Server working – debug route reached" })
);
app.get("/", (_req, res) => res.send("🛒 Flipkart Backend API is running!"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
