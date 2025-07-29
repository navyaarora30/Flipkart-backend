const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);


// 🔐 Signup Route
router.post("/auth/signup", async (req, res) => {

// ✅ FIXED: Remove `/auth` from here
router.post("/signup", async (req, res) => {

  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 🛠️ Fixed bcrypt.hash (you passed an array before!)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }

});

// 🔑 Login Route
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, "secret", {
        expiresIn: "1h",
      });
      return res.status(200).json({ token });
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// 🔒 JWT Middleware

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
  res.status(200).json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
    res.status(200).json({ token });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});


function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { router, authenticateJWT };
