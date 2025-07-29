require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const fs = require("fs");

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    const rawData = fs.readFileSync("data.json");
    const jsonData = JSON.parse(rawData);

    const products = jsonData.products || jsonData;

    await Product.deleteMany(); // optional: clear existing
    await Product.insertMany(products);
    console.log("✅ Data imported successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error importing data:", err);
    process.exit(1);
  });
