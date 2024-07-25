// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9R8bBPTFnye0EpcpDK5M0Ta5YDkjTRk0",
  authDomain: "chat-with-pdf-6d543.firebaseapp.com",
  projectId: "chat-with-pdf-6d543",
  storageBucket: "chat-with-pdf-6d543.appspot.com",
  messagingSenderId: "31487441373",
  appId: "1:31487441373:web:b16e55f2c70cf3f3d89e34",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

