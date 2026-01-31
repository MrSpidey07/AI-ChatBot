import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { auth } from "../config/firebase.config.js";
import User from "../models/user.model.js";

dotenv.config();

// Legacy JWT token generation (keep for migration period)
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

// Create Firebase custom token for server-side authentication
export const createFirebaseCustomToken = async (firebaseUID) => {
  try {
    return await auth.createCustomToken(firebaseUID);
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw error;
  }
};

// Sync Firebase user data to MongoDB
export const syncFirebaseUser = async (firebaseUID) => {
  try {
    const firebaseUser = await auth.getUser(firebaseUID);

    await User.findOneAndUpdate(
      { firebaseUID },
      {
        email: firebaseUser.email,
        isVerified: firebaseUser.emailVerified,
        fullname: firebaseUser.displayName || undefined,
      },
      { new: true }
    );

    return firebaseUser;
  } catch (error) {
    console.error("Error syncing Firebase user:", error);
    throw error;
  }
};
