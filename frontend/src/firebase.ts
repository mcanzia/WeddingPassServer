import { initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signInAnonymously, signInWithPopup, sendPasswordResetEmail} from 'firebase/auth';
import { getFirestore, doc, getDoc, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

let firebaseConfig = {};
if (import.meta.env.VITE_FIREBASE_CONFIG) {
  firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
}

const firebaseApp = initializeApp(firebaseConfig);

interface AuthFunctions extends Auth {
  createUserWithEmailAndPassword: any;
  signInWithEmailAndPassword: any;
  signInAnonymously: any;
  signInWithPopup: any;
  GoogleAuthProvider: any;
  sendPasswordResetEmail : any;
}

let auth = getAuth(firebaseApp) as AuthFunctions;
auth.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
auth.signInWithEmailAndPassword = signInWithEmailAndPassword;
auth.signInAnonymously = signInAnonymously;
auth.signInWithPopup = signInWithPopup;
auth.GoogleAuthProvider = GoogleAuthProvider;
auth.sendPasswordResetEmail = sendPasswordResetEmail;

let db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);

export {auth, db, doc, getDoc, storage};