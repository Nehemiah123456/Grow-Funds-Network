const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --------------------
//  CONNECT TO MONGODB
// --------------------
mongoose.connect(
  "mongodb+srv://Vercel-Admin-grow-funds-network:Deborah1234@grow-funds-network.wpenygm.mongodb.net/?appName=grow-funds-network",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.error("Mongo Connection Error:", err));


// USER SCHEMA
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  ssn: String,
});

const User = mongoose.model("User", UserSchema);


// --------------------
//  REGISTER ROUTE
// --------------------
app.post("/register", async (req, res) => {
  try {
    const { email, password, ssn } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    await User.create({ email, password, ssn });

    res.json({ success: true, message: "Registration successful" });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Registration failed" });
  }
});


// --------------------
//  LOGIN ROUTE
// --------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    res.json({ success: true, message: "Login successful" });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Login failed" });
  }
});


// --------------------
//  START SERVER
// --------------------
app.listen(3000, () => console.log("Server running on port 3000"));