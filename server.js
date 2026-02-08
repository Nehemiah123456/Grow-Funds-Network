const express = require("express");const mongoose = require("mongoose");const cors = require("cors");

const app = express();app.use(cors());app.use(express.json());

// CONNECT TO MONGODB ATLASmongoose.connect("YOUR_MONGODB_ATLAS_URL").then(() => console.log("DB Connected")).catch(err => console.log(err));

// USER SCHEMAconst User = mongoose.model("User", {email: String,password: String,ssn: String,plan: String,deposit: Number});

// REGISTER ROUTEapp.post("/register", async (req, res) => {const user = new User(req.body);await user.save();res.json({ message: "User registered successfully!" });});

// LOGIN ROUTEapp.post("/login", async (req, res) => {const { email, password } = req.body;const user = await User.findOne({ email, password });

if (!user) return res.json({ success: false });

res.json({ success: true });});

app.listen(3000, () => console.log("Server running on port 3000"));