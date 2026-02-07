const API = "https://your-app.onrender.com/api";

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