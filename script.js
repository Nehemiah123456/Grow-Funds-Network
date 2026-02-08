const prefix = "/backend";

// Register route
app.post(`${prefix}/register`, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true, message: "User registered!" });
  } catch(err) {
    res.json({ success: false, error: err.message });
  }
});

// Login route
app.post(`${prefix}/login`, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.json({ success: false });
  res.json({ success: true });
});

// Get user info
app.get(`${prefix}/user/:email`, async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }, "-_id email plan deposit referral");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch(err) {
    res.json({ success: false, error: err.message });
  }

const backendURL = "https://growfundsnetwork.vercel.app/backend";

async function registerUser() {
  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    ssn: document.getElementById("ssn").value,
    plan: document.getElementById("plan").value,
    deposit: parseFloat(document.getElementById("deposit").value) || 0
  };

  try {
    const res = await fetch(`${backendURL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.success ? "Registered!" : "Error: " + result.error);
  } catch(err) {
    alert("Server Error: " + err.message);
  }
}
});