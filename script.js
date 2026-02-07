async function registerUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const ssn = document.getElementById('ssn').value;
  const plan = document.getElementById('plan').value;
  const deposit = document.getElementById('deposit').value;
  const referrer = localStorage.getItem('referrer') || '';

  const data = { email, password, ssn, plan, deposit, referrer };

  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  alert(result.message || result.error);
}