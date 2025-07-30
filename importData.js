require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const fs = require("fs");

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    const rawData = fs.readFileSync("data.json", "utf-8");
    const jsonData = JSON.parse(rawData);

    // Handle both cases: either { products: [...] } OR [...] directly
    const products = Array.isArray(jsonData)
      ? jsonData
      : jsonData.products || jsonData.data;

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("❌ No valid products found in data.json");
    }

    await Product.deleteMany(); // optional: clear existing
    await Product.insertMany(products);
    console.log("✅ Data imported successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error importing data:", err);
    process.exit(1);
  });
