import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: typeof process !== 'undefined' ? process.env?.FIREBASE_API_KEY : undefined,
  authDomain: typeof process !== 'undefined' ? process.env?.FIREBASE_AUTH_DOMAIN : undefined,
  projectId: typeof process !== 'undefined' ? process.env?.FIREBASE_PROJECT_ID : undefined,
  storageBucket: typeof process !== 'undefined' ? process.env?.FIREBASE_STORAGE_BUCKET : undefined,
  messagingSenderId: typeof process !== 'undefined' ? process.env?.FIREBASE_MESSAGING_SENDER_ID : undefined,
  appId: typeof process !== 'undefined' ? process.env?.FIREBASE_APP_ID : undefined,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

if (hasConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db, hasConfig as isFirebaseEnabled };
