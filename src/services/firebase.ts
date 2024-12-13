import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { ApiError, handleApiError } from '../utils/apiErrors';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  throw ApiError.fromFirebaseError(error, 'Firebase Initialization');
}

export const auth = getAuth(app);
// Configure auth persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

export const db = getFirestore(app);
export const messaging = typeof window !== 'undefined' && 'serviceWorker' in navigator 
  ? getMessaging(app) 
  : null;

// Utility function for handling Firebase operations with retries
export const withFirebaseErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const apiError = ApiError.fromFirebaseError(error, context);
    await handleApiError(apiError);
    throw apiError;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    // Clear any Firebase-specific persistence
    await setPersistence(auth, browserLocalPersistence);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};