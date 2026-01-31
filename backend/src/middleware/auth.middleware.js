import { auth } from "../config/firebase.config.js";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUID: decodedToken.uid }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user and Firebase UID to request
    req.user = user;
    req.firebaseUID = decodedToken.uid;

    next();
  } catch (error) {
    console.log("Error in Auth Middleware", error);

    // Handle Firebase-specific errors
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.code === "auth/argument-error") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    res.status(500).json({ message: "Authentication failed" });
  }
};
