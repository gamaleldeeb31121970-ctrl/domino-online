// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// 👇 إعدادات مشروعك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAwyE1ZD4hc7E_T2HGcSiUkW2vkkGTMDWw",
  authDomain: "smartplayportal-2d950.firebaseapp.com",
  projectId: "smartplayportal-2d950",
  storageBucket: "smartplayportal-2d950.firebasestorage.app",
  messagingSenderId: "990435573818",
  appId: "1:990435573818:web:b052b7633dd3d131c3b503",
  measurementId: "G-QG707935DM"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تهيئة الخدمات اللي هتستخدمها في مشروعك
export const db = getFirestore(app);   // قاعدة البيانات
export const auth = getAuth(app);      // تسجيل الدخول / Auth
export const analytics = getAnalytics(app); // التحليلات

export default app;
