
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDPaksS8tytANUsWp0GKu_YjI2IVtovwzY",
  authDomain: "family-finance-tracker1.firebaseapp.com",
  projectId: "family-finance-tracker1",
  storageBucket: "family-finance-tracker1.firebasestorage.app",
  messagingSenderId: "607790311142",
  appId: "1:607790311142:web:94e563a3bc52024b0f7d27",
  measurementId: "G-D30M1LEPZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Configure Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection even when one account is available
});

// Add debug logging
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
});

console.log('Firebase initialized with config:', {
  ...firebaseConfig,
  apiKey: '[HIDDEN]' // Don't log the actual API key
});
