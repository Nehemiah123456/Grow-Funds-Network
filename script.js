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

function register(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
  .then(user=>{
    db.collection("users").doc(user.user.uid).set({
      email: email,
      balance: 15,
      plan: "Free",
      created: new Date()
    });

    alert("Account created! $15 bonus added.");
    window.location="dashboard.html";
  });
}

function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email,password)
  .then(()=>{
    window.location="dashboard.html";
  });
}