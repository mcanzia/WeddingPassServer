import admin, { ServiceAccount } from 'firebase-admin';
const serviceKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : require('./serviceAccountKey.json');

if (process.env.NODE_ENV === 'test') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  admin.initializeApp({
    projectId: 'weddingpass-dev'
  });
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceKey as ServiceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const firebaseAdmin = admin;