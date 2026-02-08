const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ====== CONNECT TO MONGODB ATLAS ======
mongoose.connect("YOUR_MONGODB_URL_HERE")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Error:", err));

// ====== USER MODEL ======
const User = mongoose.model("User", {
  email: String,
  password: String,
  ssn: String,
  plan: String,
  deposit: Number,
  createdAt: { type: Date, default: Date.now }
});

// ====== CUSTOM PREFIX ======
const prefix = "/backend";


// ====== REGISTER ROUTE ======
app.post(`${prefix}/register`, async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.json({ success: false, error: "Email already registered" });

    const user = new User(req.body);
    await user.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});


// ====== LOGIN ROUTE ======
app.post(`${prefix}/login`, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) return res.json({ success: false, message: "Invalid credentials" });

  res.json({ success: true });
});


// ====== GET USER BY EMAIL ======
app.get(`${prefix}/user/:email`, async (req, res) => {
  const user = await User.findOne(
    { email: req.params.email },
    "-_id email plan deposit createdAt"
  );

  if (!user) return res.json({ success: false });

  res.json({ success: true, user });
});


// ====== START SERVER ======
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});