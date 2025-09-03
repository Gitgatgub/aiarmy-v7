// firebase.js
// 1. Import the necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 2. Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe22oVd8R74M6iDgbS1SLTT64gcbOKIec",
  authDomain: "ai-army-cb8d0.firebaseapp.com",
  projectId: "ai-army-cb8d0",
  storageBucket: "ai-army-cb8d0.firebasestorage.app",
  messagingSenderId: "181069137156",
  appId: "1:181069137156:web:2f7f8da09d49f77342bc51",
  measurementId: "G-MQM3NZ653X"
};

// 3. Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// 4. Initialize Analytics (optional)
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

// 5. Initialize Authentication
const auth = getAuth(app);

// 6. Initialize Firestore
const db = getFirestore(app);

// 7. Export your Firebase services
export { auth, db };