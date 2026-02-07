const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1️⃣ Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://websiteUser:YourPassword@cluster0.abcd123.mongodb.net/growFundsDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// 2️⃣ User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ssn: String,
  plan: String,
  deposit: Number,
  referrer: String
});

const User = mongoose.model('User', userSchema);

// 3️⃣ Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password, ssn, plan, deposit, referrer } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      ssn,
      plan,
      deposit,
      referrer
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4️⃣ Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));