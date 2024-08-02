// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnfN3-FatiPAXCywL94lWCWmz7nlERIFo",
  authDomain: "inventory-management-900fe.firebaseapp.com",
  projectId: "inventory-management-900fe",
  storageBucket: "inventory-management-900fe.appspot.com",
  messagingSenderId: "110119451431",
  appId: "1:110119451431:web:0f5097d48e2a687585c702",
  measurementId: "G-0S3LE1GVEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}
