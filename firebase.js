import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore, doc, setDoc, addDoc, collection, getDocs, deleteDoc, query, where, updateDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDcUJ4GsTQqUW_G5GH-GVDelUI_FeHdmRo",
    authDomain: "taylor-website-73310.firebaseapp.com",
    projectId: "taylor-website-73310",
    storageBucket: "taylor-website-73310.appspot.com",
    messagingSenderId: "685894204760",
    appId: "1:685894204760:web:848ff8931c5106c380792d",
    measurementId: "G-YF15C8P755"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, db, doc, setDoc,
    addDoc, collection, getDocs, deleteDoc, query, where, updateDoc, getDoc
}