router.post("/auth/signup", async (req, res) => {
  try {
    console.log("🔸 SIGNUP BODY:", req.body); // log incoming data

    const { firstName, lastName, mobile, gender, email, password } = req.body;

    if (!firstName || !lastName || !mobile || !gender || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("🔸 Creating new user...");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      mobile,
      gender,
      email,
      password: hashedPassword,
    });

    await user.save(); // <- this line may be throwing the error

    console.log("✅ User saved successfully");

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
    console.error("❌ Signup error:", err); // 👈 catch the real error!
    res.status(500).json({ error: "Signup failed" });
  }
});
