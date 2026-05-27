const firebaseConfig = {
  apiKey: "AIzaSyBhUDrgwIW4L7YqePidRdBnVLDzn3aHNX0",
  authDomain: "erp-constructora.firebaseapp.com",
  projectId: "erp-constructora",
  storageBucket: "erp-constructora.firebasestorage.app",
  messagingSenderId: "917410598919",
  appId: "1:917410598919:web:a7d4b790644564438bdaa2"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();