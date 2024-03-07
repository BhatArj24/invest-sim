import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApxysmJlKUshGouAKZBOnkNUqiVQZG6xw",
  authDomain: "investsim-15dce.firebaseapp.com",
  projectId: "investsim-15dce",
  storageBucket: "investsim-15dce.appspot.com",
  messagingSenderId: "516105259828",
  appId: "1:516105259828:web:b4f7487e2a753ce6b13361",
  measurementId: "G-8KE19WBTHS"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);