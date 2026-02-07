const API = "https://YOUR_BACKEND_URL/api"; // example: http://localhost:5000/api

// REGISTER
async function registerUser(){
  try{
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        ssn: document.getElementById("ssn").value,
        plan: document.getElementById("plan").value,
        deposit: document.getElementById("deposit").value,
        referrer: localStorage.getItem("referrer")
      })
    });

    const data = await res.json();

    if(data.success){
      alert("Registration successful");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Registration failed");
    }

  } catch {
    alert("Server error");
  }
}

// LOGIN
async function loginUser(){
  try{
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });

    const data = await res.json();

    if(data.token){
      localStorage.setItem("token", data.token);

      if(data.role === "admin"){
        window.location.href = "admin/dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } else {
      alert("Invalid login");
    }

  } catch {
    alert("Server error");
  }
}