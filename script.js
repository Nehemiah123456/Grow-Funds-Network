async function registerUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const ssn = document.getElementById('ssn').value;
  const plan = document.getElementById('plan').value;
  const deposit = parseFloat(document.getElementById('deposit').value);
  const referrer = localStorage.getItem('referrer') || '';

  if(!email || !password) {
    alert("Email and password are required!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, ssn, plan, deposit, referrer })
    });

    const result = await response.json();
    alert(result.message || result.error);

  } catch(err) {
    alert("Error connecting to server!");
    console.error(err);
  }
}