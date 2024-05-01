import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FirebaseApiKey,
  authDomain: import.meta.env.VITE_FirebaseAuthDomain,
  projectId: import.meta.env.VITE_FirebaseProjectId,
  storageBucket: import.meta.env.VITE_FirebaseStorageBucket,
  messagingSenderId: import.meta.env.VITE_FirebaseMessagingSenderId,
  appId: import.meta.env.VITE_FirebaseAppId,
  measurementId: import.meta.env.VITE_MeasurementId,
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
