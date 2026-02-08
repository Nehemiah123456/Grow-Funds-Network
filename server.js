const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===== Connect to MongoDB =====
// Replace <db_username> with your MongoDB username
const mongoURI = "mongodb+srv://local:Deborah1234@grow-funds-network.wpenygm.mongodb.net/growfundsnetwork?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

// ===== User Model =====
const User = mongoose.model("User", {
  email: String,
  password: String,
  ssn: String,
  plan: String,
  deposit: Number,
  referral: String, // optional
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

// ===== Get user info =====
app.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }, "-_id email plan deposit referral");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch(err) {
    res.json({ success: false, error: err.message });
  }
});

// ===== Start Server =====
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});