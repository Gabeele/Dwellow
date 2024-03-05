// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyALGRn1e8amdYhxHVav-DxK5n4751gDkdY",
    authDomain: "dwellow-ab144.firebaseapp.com",
    projectId: "dwellow-ab144",
    storageBucket: "dwellow-ab144.appspot.com",
    messagingSenderId: "666477642597",
    appId: "1:666477642597:web:945b242fbddf15eccdd78c",
    measurementId: "G-G76NN73D1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };