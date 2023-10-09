// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User} from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSFRM9EZfISvUZIXvaXBQ_cWmrdQQhF9Q",
  authDomain: "bt88-yt-clone.firebaseapp.com",
  projectId: "bt88-yt-clone",
  appId: "1:707030055490:web:5497681ed05bb8598b4bdb",
  measurementId: "G-4J2QY3NP7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const functions = getFunctions();
/**
 * 
 * Sign the user in with a Google Popup
 * @returns A promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Triggers a callback when the user auth state changes
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}