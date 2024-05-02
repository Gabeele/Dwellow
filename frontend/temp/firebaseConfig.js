import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  REACT_APP_FirebaseApiKey, REACT_APP_FirebaseAuthDomain, REACT_APP_FirebaseProjectId, REACT_APP_FirebaseStorageBucket,
  REACT_APP_FirebaseMessagingSenderId, REACT_APP_FirebaseAppId, REACT_APP_MeasurementId
} from '@env'

// Initialize Firebase
const firebaseConfig = {
  apiKey: REACT_APP_FirebaseApiKey,
  authDomain: REACT_APP_FirebaseAuthDomain,
  projectId: REACT_APP_FirebaseProjectId,
  storageBucket: REACT_APP_FirebaseStorageBucket,
  messagingSenderId: REACT_APP_FirebaseMessagingSenderId,
  appId: REACT_APP_FirebaseAppId,
  measurementId: REACT_APP_MeasurementId
};

console.log(firebaseConfig)

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export { app };