import { initializeApp } from 'firebase/app';
import {
  Auth, getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, signInWithCredential
} from 'firebase/auth';
import { getFirestore, doc, getDoc, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

let firebaseConfig = {};
if (import.meta.env.VITE_FIREBASE_CONFIG) {
  firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
} else {
  firebaseConfig = {
    apiKey: "AIzaSyARukHSiFHh6Kg3iLSJaxeaY78yrtraoy8",
    authDomain: "weddingpass-dev.firebaseapp.com",
    projectId: "weddingpass-dev",
    storageBucket: "weddingpass-dev.appspot.com",
    messagingSenderId: "307208678427",
    appId: "1:307208678427:web:65320d575b199ccf985cbe"
  };
}

const firebaseApp = initializeApp(firebaseConfig);

interface AuthFunctions extends Auth {
  createUserWithEmailAndPassword: any;
  signInWithEmailAndPassword: any;
  signInWithPopup: any;
  GoogleAuthProvider: any;
  sendPasswordResetEmail: any;
  RecaptchaVerifier: any;
  signInWithPhoneNumber: any;
  PhoneAuthProvider: any;
  signInWithCredential: any;
}

let auth = getAuth(firebaseApp) as AuthFunctions;
auth.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
auth.signInWithEmailAndPassword = signInWithEmailAndPassword;
auth.signInWithPopup = signInWithPopup;
auth.GoogleAuthProvider = GoogleAuthProvider;
auth.sendPasswordResetEmail = sendPasswordResetEmail;
auth.RecaptchaVerifier = RecaptchaVerifier;
auth.signInWithPhoneNumber = signInWithPhoneNumber;
auth.PhoneAuthProvider = PhoneAuthProvider;
auth.signInWithCredential = signInWithCredential;


let db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);

export { auth, db, doc, getDoc, storage };