// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDsYdbYQlG0WKsLTJju__8StqDIhgDxWiw",
  authDomain: "growfundsnetwork.firebaseapp.com",
  projectId: "growfundsnetwork",
  storageBucket: "growfundsnetwork.firebasestorage.app",
  messagingSenderId: "210373001610",
  appId: "1:210373001610:web:0b70ef32f6710f669a4873",
  measurementId: "G-2ZRKNNLEHZ"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Generate random referral code
function generateReferral() {
  return "REF" + Math.floor(Math.random()*1000000);
}

// REGISTER USER
function register(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const referralCode = generateReferral();
  const referrer = localStorage.getItem("referrer") || null;

  auth.createUserWithEmailAndPassword(email, password)
  .then(user=>{
    db.collection("users").doc(user.user.uid).set({
      email: email,
      balance: 15,  // Welcome bonus
      plan: "Free",
      referralCode: referralCode,
      referredBy: referrer,
      created: new Date()
    });

    // Credit referrer bonus if applicable
    if(referrer){
      db.collection("users").where("referralCode","==",referrer).get()
      .then(snapshot=>{
        snapshot.forEach(doc=>{
          let oldBalance = doc.data().balance || 0;
          doc.ref.update({balance: oldBalance + 5}); // $5 referral bonus
        });
      });
    }

    alert("Account created! $15 bonus added.");
    window.location="dashboard.html";
  });
}

// LOGIN USER
function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email,password)
  .then(()=>{
    window.location="dashboard.html";
  });
}

// DASHBOARD FUNCTIONS
function loadDashboard(){
  const user = auth.currentUser;
  if(!user) return;

  db.collection("users").doc(user.uid).get()
  .then(doc=>{
    if(doc.exists){
      document.getElementById("userEmail").innerText = doc.data().email;
      document.getElementById("userBalance").innerText = "$"+doc.data().balance;
      document.getElementById("userPlan").innerText = doc.data().plan;
      document.getElementById("referralCode").innerText = doc.data().referralCode;
    }
  });
}

// KYC Upload
function uploadKYC(){
  const file = document.getElementById("file").files[0];
  const user = firebase.auth().currentUser;

  const ref = storage.ref("kyc/"+user.uid);
  ref.put(file).then(()=>alert("KYC Uploaded!"));
}

// ADMIN: Load all users
function loadUsers(){
  db.collection("users").get()
  .then(snapshot=>{
    let out="";
    snapshot.forEach(doc=>{
      let d = doc.data();
      out += `<b>Email:</b> ${d.email} | <b>Balance:</b> $${d.balance} | <b>Plan:</b> ${d.plan} | <b>Referral:</b> ${d.referralCode} | <b>Referred By:</b> ${d.referredBy || "None"}<br><br>`;
    });
    document.getElementById("data").innerHTML = out;
  });
}

// Save referral if someone clicked referral link
function checkReferral(){
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if(ref){
    localStorage.setItem("referrer", ref);
  }
}
checkReferral();