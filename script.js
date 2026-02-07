const API = "mongodb+srv://Vercel-Admin-grow-funds-network:<db_password>@grow-funds-network.wpenygm.mongodb.net/?appName=grow-funds-network";


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Vercel-Admin-grow-funds-network:<db_password>@grow-funds-network.wpenygm.mongodb.net/?appName=grow-funds-network";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// REGISTER
async function registerUser(){
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      plan: plan.value,
      deposit: deposit.value
    })
  });

  const data = await res.json();
  if(data.success){
    alert("Registered");
    location.href = "login.html";
  } else alert(data.error);
}

// LOGIN
async function loginUser(){
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();
  if(data.token){
    localStorage.setItem("token", data.token);
    location.href = data.role === "admin" ? "admin.html" : "dashboard.html";
  } else alert("Login failed");
}