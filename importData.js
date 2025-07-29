const mongoose = require("mongoose");
const Product = require("./models/Product");
const fs = require("fs");

// 1. Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://NavyaArora:deploy30Project09Mongo@cluster0.tpmk9y3.mongodb.net/flipkart-db"
  )
  .then(() => {
    console.log("MongoDB connected");
    importData();
  })
  .catch((err) => console.log("Connection Error:", err));

// 2. Read data from JSON file
const rawData = fs.readFileSync("./data.json");
const products = JSON.parse(rawData).products;

// 3. Insert into MongoDB
async function importData() {
  try {
    await Product.insertMany(products);
    console.log("Data imported successfully");
    process.exit(); // exit the script
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}
