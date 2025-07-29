const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// 🧠 Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: String,
  gender: { type: String, enum: ["Male", "Female"], default: "Male" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

//
// 🔐 SIGNUP
//
router.post("/auth/signup", async (req, res) => {
  const { firstName, lastName, mobile, gender, email, password } = req.body;

  // ✅ Validate required fields
  if (!firstName || !lastName || !mobile || !gender || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      mobile,
      gender,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });

    res.status(200).json({
      token,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      gender: user.gender,
      email: user.email,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

//
// 🔑 LOGIN
//
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // ✅ Validate fields
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });

    res.status(200).json({
      token,
      userId: user._id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      mobile: user.mobile || "",
      gender: user.gender || "Male",
      email: user.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

//
// 🔒 JWT Middleware (optional for protected routes)
//
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

//
// ✅ Export the router and middleware
//
module.exports = { router, authenticateJWT };
