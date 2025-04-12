import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, setPersistence, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCWN-I6UkPD8Q2-_sdGNSsEjqCTdNtouU",
  authDomain: "eventorganizerapp-d581c.firebaseapp.com",
  projectId: "eventorganizerapp-d581c",
  storageBucket: "eventorganizerapp-d581c.appspot.com",
  messagingSenderId: "782799477638",
  appId: "1:782799477638:web:0befdcc047eb90ded6aa07"
};

// Initialize Firebase app only if not already initialized
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
