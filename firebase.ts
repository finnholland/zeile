
import { initializeApp } from "firebase/app";

import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  initializeFirestore, getFirestore, collection, doc,
  getDoc, addDoc, setDoc, updateDoc, getDocs,
  query, where, orderBy, onSnapshot, serverTimestamp,
  limit, deleteDoc, startAfter, Timestamp
} from 'firebase/firestore';

import {getStorage, ref, getDownloadURL, listAll, uploadBytes, uploadString} from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCYwH_4IdnJLthMuprTLa0_fYJ-U8ss9cM",
  authDomain: "fh-zeile.firebaseapp.com",
  projectId: "fh-zeile",
  storageBucket: "fh-zeile.appspot.com",
  messagingSenderId: "508506307006",
  appId: "1:508506307006:web:0549268002c71e887521ef",
  measurementId: "G-WP3N652LHC"

};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const auth = getAuth(app);
export {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
  onAuthStateChanged,
};
export {
  initializeFirestore, getFirestore, collection, doc,
  getDoc, addDoc, setDoc, updateDoc, getDocs,
  query, where, orderBy, onSnapshot, serverTimestamp,
  limit, deleteDoc, startAfter, Timestamp
};

export {getStorage, ref, getDownloadURL, listAll, uploadBytes, uploadString};