import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Validate Firebase configuration
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT is not defined in environment variables"
  );
}

// Parse service account JSON from environment variable
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
  throw new Error(
    "Invalid FIREBASE_SERVICE_ACCOUNT JSON format in environment variables"
  );
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firebase Auth instance
export const auth = admin.auth();

console.log("✅ Firebase Admin SDK initialized successfully");
