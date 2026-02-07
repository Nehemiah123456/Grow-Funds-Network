// -----------------------------
// FIREBASE CONFIG & INIT
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDsYdbYQlG0WKsLTJju__8StqDIhgDxWiw",
  authDomain: "growfundsnetwork.firebaseapp.com",
  databaseURL: "https://growfundsnetwork-default-rtdb.firebaseio.com",
  projectId: "growfundsnetwork",
  storageBucket: "growfundsnetwork.firebasestorage.app",
  messagingSenderId: "210373001610",
  appId: "1:210373001610:web:0b70ef32f6710f669a4873",
  measurementId: "G-2ZRKNNLEHZ"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

// -----------------------------
// PLAN LIMITS
// -----------------------------
const plans = {
  starter: {min:10,max:97},
  builder: {min:100,max:999},
  income: {min:1000,max:9999},
  premium: {min:10000,max:99999},
  elite: {min:100000,max:1000000}
};

// -----------------------------
// REGISTER FUNCTION
// -----------------------------
async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const ssn = document.getElementById('ssn').value;
  const dlFile = document.getElementById('dl').files[0];
  const plan = document.getElementById('planSelect').value;
  const depositInput = parseFloat(document.getElementById('depositAmount').value) || 0;

  if(!email || !password){
    alert("Email and password are required.");
    return;
  }

  try {
    // 1️⃣ Create Firebase Auth User
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    // 2️⃣ Referral & code
    const referralCode = "REF" + Math.floor(Math.random()*1000000);
    const referrer = localStorage.getItem("referrer") || null;

    // 3️⃣ Upload Driver's License
    let dlURL = "";
    if(dlFile){
      const storageRef = storage.ref(`driver_licenses/${uid}_${dlFile.name}`);
      const snapshot = await storageRef.put(dlFile);
      dlURL = await snapshot.ref.getDownloadURL();
    }

    // 4️⃣ Validate deposit
    let depositAmount = depositInput;
    if(depositAmount < plans[plan].min) depositAmount = plans[plan].min;
    if(depositAmount > plans[plan].max) depositAmount = plans[plan].max;

    // 5️⃣ Save user in Realtime Database
    await db.ref('users/' + uid).set({
      email: email,
      ssn: ssn,
      dlURL: dlURL,
      balance: depositAmount,
      plan: plan,
      referralCode: referralCode,
      referredBy: referrer,
      createdAt: new Date().toISOString()
    });

    // 6️⃣ Update progress bar
    const progressBar = document.getElementById("depositProgress");
    const percent = Math.min((depositAmount / plans[plan].max) * 100, 100);
    progressBar.style.width = percent + "%";
    progressBar.innerText = Math.round(percent) + "%";

    alert("Account created successfully! $15 bonus added.");
    window.location.href = "dashboard.html";

  } catch(err){
    console.error(err);
    alert("Error: " + err.message);
  }
}

// -----------------------------
// LOGIN FUNCTION
// -----------------------------
function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(()=> window.location = "dashboard.html")
    .catch(err => alert(err.message));
}

// -----------------------------
// LINK REGISTER BUTTON AFTER PAGE LOAD
// -----------------------------
window.onload = function() {
  const btn = document.getElementById('registerBtn');
  if(btn) btn.onclick = register;
};