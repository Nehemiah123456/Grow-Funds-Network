// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDsYdbYQlG0WKsLTJju__8StqDIhgDxWiw",
  authDomain: "growfundsnetwork.firebaseapp.com",
  projectId: "growfundsnetwork",
  storageBucket: "growfundsnetwork.firebasestorage.app",
  messagingSenderId: "210373001610",
  appId: "1:210373001610:web:0b70ef32f6710f669a4873",
  measurementId: "G-2ZRKNNLEHZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Generate random referral code
function generateReferral() {
    return "REF" + Math.floor(Math.random() * 1000000);
}

// Registration
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const ssn = document.getElementById("ssn").value;
    const dlFile = document.getElementById("dl").files[0];
    const referralCode = generateReferral();
    const referrer = localStorage.getItem("referrer") || null;

    if (!email || !password || !ssn || !dlFile) {
        alert("Please fill all fields and upload your document");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
    .then(user => {
        const dlRef = storage.ref("kyc/" + user.user.uid + "_dl");
        dlRef.put(dlFile).then(()=>console.log("DL uploaded"));

        db.collection("users").doc(user.user.uid).set({
            email: email,
            balance: 15,
            plan: "Free",
            referralCode: referralCode,
            referredBy: referrer,
            ssn: ssn,
            created: new Date()
        });

        if(referrer){
            db.collection("users").where("referralCode","==",referrer).get()
            .then(snapshot=>{
                snapshot.forEach(doc=>{
                    let oldBalance = doc.data().balance || 0;
                    doc.ref.update({balance: oldBalance + 5});
                });
            });
        }

        alert("Account created! $15 bonus added.");
        window.location="dashboard.html";
    })
    .catch(err => alert(err.message));
}

// Login
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email,password)
    .then(()=> window.location="dashboard.html")
    .catch(err=> alert(err.message));
}

// Dashboard Data
function loadDashboard() {
    const user = auth.currentUser;
    if(!user) return;

    db.collection("users").doc(user.uid).get()
    .then(doc=>{
        if(doc.exists){
            const data = doc.data();
            document.getElementById("userEmail").innerText = data.email;
            document.getElementById("userBalance").innerText = data.balance;
            document.getElementById("userPlan").innerText = data.plan;
            document.getElementById("referralCode").innerText = data.referralCode;

            let progressPercent = Math.min((data.balance/1000)*100,100);
            animateProgressBar(document.getElementById("progress"), progressPercent);
            animateCounter(document.getElementById("userBalance"), data.balance);
        }
    });

    db.collection("users").where("referredBy","==",user.uid).get()
    .then(snapshot=>{
        let count = 0, bonus = 0;
        snapshot.forEach(doc=>{
            count++;
            bonus += 5;
        });
        animateCounter(document.getElementById("refCount"), count);
        animateCounter(document.getElementById("refBonus"), bonus);
    });
}

// Progress Bar Animation
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

// Counter Animation
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

// KYC Upload
function uploadKYC() {
    const file = document.getElementById("file").files[0];
    const user = auth.currentUser;
    if(!file){ alert("Please select a file"); return; }

    storage.ref("kyc/"+user.uid+"_extra").put(file)
    .then(()=> alert("KYC Uploaded!"));
}

// Referral Check
function checkReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if(ref) localStorage.setItem("referrer", ref);
}
checkReferral();

// Live Crypto Prices
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

// Admin Load Users
function loadUsers() {
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