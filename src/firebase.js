// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfi1xLvRoBZ0kOxH0POBsw3vniFGGZnus",
  authDomain: "akagod-s-movie-library.firebaseapp.com",
  projectId: "akagod-s-movie-library",
  storageBucket: "akagod-s-movie-library.appspot.com",
  messagingSenderId: "778386891240",
  appId: "1:778386891240:web:108125e7fb7b50a6af045d",
  measurementId: "G-V3ESMG3V1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
