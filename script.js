<script>
async function registerUser() {
    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        ssn: document.getElementById("ssn").value,
        plan: document.getElementById("plan").value,
        deposit: document.getElementById("deposit").value
    };

    const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
    });

    const data = await res.json();
    alert(data.message);
}
</script>