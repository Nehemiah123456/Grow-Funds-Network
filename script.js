// 1️⃣ Firebase Config
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

// 2️⃣ Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// 3️⃣ Initialize services AFTER app
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

// 4️⃣ Registration Function (now `auth` is defined)
async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const ssn = document.getElementById('ssn').value;
  const dlFile = document.getElementById('dl').files[0];

  if (!email || !password) {
    alert('Email and password are required.');
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const uid = user.uid;

    let dlURL = "";
    if (dlFile) {
      const storageRef = storage.ref(`driver_licenses/${uid}_${dlFile.name}`);
      const snapshot = await storageRef.put(dlFile);
      dlURL = await snapshot.ref.getDownloadURL();
    }

    const referralCode = "REF" + Math.floor(Math.random() * 1000000);
    const referrer = localStorage.getItem("referrer") || null;

    await db.ref('users/' + uid).set({
      email: email,
      ssn: ssn,
      dlURL: dlURL,
      balance: 0,
      plan: "Free",
      referralCode: referralCode,
      referredBy: referrer,
      createdAt: new Date().toISOString()
    });

    alert("Account created successfully! $15 bonus added.");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message);
  }
}
// -----------------------------
// LOGIN FUNCTION
// -----------------------------
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location = "dashboard.html")
    .catch(err => alert(err.message));
}

// -----------------------------
// LOAD DASHBOARD DATA
// -----------------------------
function loadDashboard() {
  const user = auth.currentUser;
  if(!user) return;

  db.ref('users/' + user.uid).once('value').then(snapshot => {
    const data = snapshot.val();
    if (!data) return;

    document.getElementById("userEmail").innerText = data.email;
    document.getElementById("userBalance").innerText = data.balance;
    document.getElementById("userPlan").innerText = data.plan;
    document.getElementById("referralCode").innerText = data.referralCode;

    // Progress bar (example: balance / 1000)
    let progressPercent = Math.min((data.balance / 1000) * 100, 100);
    animateProgressBar(document.getElementById("progress"), progressPercent);
  });

  // Referral bonus
  db.ref('users').orderByChild("referredBy").equalTo(user.uid).once('value').then(snapshot => {
    let count = snapshot.numChildren();
    let bonus = count * 5;
    animateCounter(document.getElementById("refCount"), count);
    animateCounter(document.getElementById("refBonus"), bonus);
  });
}

// -----------------------------
// PROGRESS BAR ANIMATION
// -----------------------------
function animateProgressBar(element, percent){
  let width = 0;
  const id = setInterval(()=>{
    if(width >= percent){
      clearInterval(id);
    } else {
      width++;
      element.style.width = width + "%";
    }
  }, 10);
}

// -----------------------------
// COUNTER ANIMATION
// -----------------------------
function animateCounter(element, target){
  let count = 0;
  const increment = target > 100 ? Math.ceil(target/100) : 1;
  const id = setInterval(()=>{
    if(count >= target){
      clearInterval(id);
      element.innerText = target;
    } else {
      count += increment;
      element.innerText = count;
    }
  }, 20);
}

// -----------------------------
// REFERRAL CHECK
// -----------------------------
function checkReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if(ref) localStorage.setItem("referrer", ref);
}
checkReferral();

// -----------------------------
// KYC UPLOAD (Extra files)
// -----------------------------
function uploadKYC() {
  const file = document.getElementById("file").files[0];
  const user = auth.currentUser;
  if(!file){ alert("Please select a file"); return; }

  storage.ref("kyc/"+user.uid+"_extra").put(file)
    .then(()=> alert("KYC Uploaded!"));
}

// -----------------------------
// LIVE CRYPTO PRICES (Optional)
// -----------------------------
function animatePrice(element, newValue){
  let current = parseFloat(element.innerText.replace('$','')) || 0;
  const diff = newValue - current;
  let step = diff / 20;
  let i = 0;
  const interval = setInterval(()=>{
    if(i >= 20){
      clearInterval(interval);
      element.innerText = "$" + newValue.toFixed(2);
    } else {
      current += step;
      element.innerText = "$" + current.toFixed(2);
      i++;
    }
  }, 50);
}

function loadCryptoPrices(){
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd")
    .then(res=>res.json())
    .then(data=>{
      animatePrice(document.getElementById("btcPrice"), data.bitcoin.usd);
      animatePrice(document.getElementById("ethPrice"), data.ethereum.usd);
      animatePrice(document.getElementById("usdtPrice"), data.tether.usd);
    })
    .catch(err=>console.log(err));
}
loadCryptoPrices();
setInterval(loadCryptoPrices, 10000);

// -----------------------------
// ADMIN LOAD USERS
// -----------------------------
function loadUsers() {
  db.ref('users').once('value').then(snapshot=>{
    const users = snapshot.val();
    let out = "";
    for(const uid in users){
      const d = users[uid];
      out += `<b>Email:</b> ${d.email} | <b>Balance:</b> $${d.balance} | <b>Plan:</b> ${d.plan} | <b>Referral:</b> ${d.referralCode} | <b>Referred By:</b> ${d.referredBy || "None"}<br><br>`;
    }
    document.getElementById("data").innerHTML = out;
  });
}