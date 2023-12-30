import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  //config
  apiKey: "AIzaSyCJKObE9TiNQeNt2fyhLmEBEGWjfM0_j0w",
  authDomain: "fir-54463.firebaseapp.com",
  projectId: "fir-54463",
  storageBucket: "fir-54463.appspot.com",
  messagingSenderId: "939922717548",
  appId: "1:939922717548:web:ce20d698d3fc928ef9d149",
  measurementId: "G-HW5WH8T9NH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);