import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 🧩 User model
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  plan: String,
  deposit: Number,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// 📝 REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 12);

    await User.create({
      email: req.body.email,
      password: hashed,
      plan: req.body.plan,
      deposit: req.body.deposit
    });

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "User already exists" });
  }
});

// 🔐 LOGIN
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(401).json({ error: "Invalid login" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if(!ok) return res.status(401).json({ error: "Invalid login" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, role: user.role });
});

// 🚀 Start
app.listen(5000, () => console.log("Server running"));