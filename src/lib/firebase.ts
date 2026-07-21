import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "gen-lang-client-0680884976",
  appId: "1:646289110995:web:56f284ff3a863136dee126",
  apiKey: "AIzaSyC89xqeiwYfXUk4gDWYFbWR0x47IN_qEZI",
  authDomain: "gen-lang-client-0680884976.firebaseapp.com",
  storageBucket: "gen-lang-client-0680884976.firebasestorage.app",
  messagingSenderId: "646289110995",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-petpass-14443ddb-1eb2-4ccc-8f01-4a699073e789");
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
