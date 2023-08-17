
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
  apiKey: "AIzaSyAkrYArQpUyKRTVVXpW1YbY36o3tWfKOWw",
  authDomain: "fh-zeile-test.firebaseapp.com",
  projectId: "fh-zeile-test",
  storageBucket: "fh-zeile-test.appspot.com",
  messagingSenderId: "678966258286",
  appId: "1:678966258286:web:00328b6c836894ce3fd47f"
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