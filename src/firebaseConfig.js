import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCq90-n75bzZ1meo8T9kAX2exdYCkHRecc",
  authDomain: "react-ecommerceapp-ffccd.firebaseapp.com",
  projectId: "react-ecommerceapp-ffccd",
  storageBucket: "react-ecommerceapp-ffccd.firebasestorage.app",
  messagingSenderId: "231363049549",
  appId: "1:231363049549:web:7d6043d067bc0a0db8c404",
  measurementId: "G-YZDHVTST6V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore Database
export const db = getFirestore(app);