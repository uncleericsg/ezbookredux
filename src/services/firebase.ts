/**
 * @file Firebase Configuration and Initialization
 * 
 * IMPORTANT: This is the ONLY file that should initialize Firebase in the entire application.
 * DO NOT create additional Firebase initialization files to prevent duplicate app errors.
 * 
 * Features included:
 * - Firebase Authentication with persistence
 * - Firestore Database
 * - Firebase Cloud Messaging
 * 
 * @singleton This file exports a singleton instance of Firebase app and services
 */

// @firebase-integration Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

export default {
  app,
  auth,
  db,
  messaging
};