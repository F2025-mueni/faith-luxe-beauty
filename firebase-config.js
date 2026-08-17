// ==========================================
// FAITH LUXE BEAUTY
// FIREBASE CONFIGURATION
// ==========================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


// Firebase configuration

const firebaseConfig = {

    apiKey:
        "AIzaSyD1dXUu-2Y74C1t0rPwzNNKM09sbEgaxSQ",

    authDomain:
        "faith-luxe-beauty.firebaseapp.com",

    projectId:
        "faith-luxe-beauty",

    storageBucket:
        "faith-luxe-beauty.firebasestorage.app",

    messagingSenderId:
        "601487205476",

    appId:
        "1:601487205476:web:a7ae7d8eb8085a41b52b71"

};


// Initialize Firebase

const app =
    initializeApp(firebaseConfig);


// Export Firebase app

export { app };