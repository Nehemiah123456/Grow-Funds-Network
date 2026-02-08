const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===== Connect to MongoDB =====
// Replace YOUR_MONGODB_ATLAS_URL with your real connection string
mongoose.connect("YOUR_MONGODB_ATLAS_URL")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

const User = mongoose.model("User", {
  email: String,
  password: String,
  ssn: String,
  plan: String,
  deposit: Number
});

// ===== Register Route =====
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true, message: "User registered!" });
  } catch(err) {
    res.json({ success: false, error: err.message });
  }
});

// ===== Login Route =====
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.json({ success: false });
  res.json({ success: true });
});

// ===== Start Server =====
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});