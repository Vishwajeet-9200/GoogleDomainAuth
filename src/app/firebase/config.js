import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKgBAzKv2ilLDkg6RW3_UQ3jMoEE1D9nY",
  authDomain: "hb-plus-authentication-facf3.firebaseapp.com",
  projectId: "hb-plus-authentication-facf3",
  storageBucket: "hb-plus-authentication-facf3.firebasestorage.app",
  messagingSenderId: "513461596826",
  appId: "1:513461596826:web:d7eb522924f1f791492523",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
