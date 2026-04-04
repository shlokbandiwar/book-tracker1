import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Your web app's Firebase configuration
// This should be replaced with actual env variables when deploying
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_MOCK_api_key_replace_me",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "12345",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:12345:web:abc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Enable offline persistence for blazing fast UI and offline support
// We enclose this in a safely caught promise as it can fail if multiple tabs are open
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
      console.warn("Firebase persistence error: Multiple tabs open.");
  } else if (err.code === 'unimplemented') {
      console.warn("Firebase persistence not supported by browser.");
  }
});
