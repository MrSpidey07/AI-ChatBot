import User from "../models/user.model.js";
import { auth } from "../config/firebase.config.js";
import { syncFirebaseUser } from "../lib/utils.js";

export const login = async (req, res) => {
  const { idToken } = req.body;

  try {
    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token required" });
    }

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUID: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ 
        message: "User not found. Please register first." 
      });
    }

    // Sync user data from Firebase (email verification status)
    await syncFirebaseUser(decodedToken.uid);

    // Refresh user data after sync
    user = await User.findOne({ firebaseUID: decodedToken.uid }).select("-password");

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        isVerified: user.isVerified,
      },
      firebaseUID: decodedToken.uid,
    });
  } catch (error) {
    console.log("Error in Login", error);
    
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.code === "auth/argument-error") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // 1. CHECK MONGODB FIRST (Prevent duplicates)
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // User exists in MongoDB
      if (existingUser.firebaseUID) {
        // Already has Firebase account
        return res.status(400).json({ 
          message: "Email already registered. Please login." 
        });
      } else {
        // Old user without Firebase - needs migration
        return res.status(400).json({ 
          message: "Account exists. Please use 'Forgot Password' to migrate your account.",
          needsMigration: true,
          email: email
        });
      }
    }

    // 2. CREATE FIREBASE USER (Using Admin SDK)
    const firebaseUser = await auth.createUser({
      email: email,
      password: password,
      displayName: fullName,
      emailVerified: false,
    });

    // 3. CREATE MONGODB RECORD
    const newUser = new User({
      firebaseUID: firebaseUser.uid,
      fullname: fullName,
      email: email,
      isVerified: false,
    });

    await newUser.save();

    // 4. RETURN SUCCESS WITH FIREBASE UID
    // Frontend will use this UID to send verification email via Firebase Client SDK
    res.status(201).json({
      message: "User created successfully. Please verify your email.",
      firebaseUID: firebaseUser.uid,
      userId: newUser._id,
      email: email,
      requiresEmailVerification: true
    });
  } catch (error) {
    console.log("Error in register", error);

    // Handle Firebase-specific errors
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ 
        message: "Email already exists in Firebase" 
      });
    }
    if (error.code === "auth/invalid-email") {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (error.code === "auth/weak-password") {
      return res.status(400).json({ 
        message: "Password is too weak. Use at least 6 characters." 
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { firebaseUID } = req.body;

    if (!firebaseUID) {
      return res.status(400).json({ message: "Firebase UID required" });
    }

    // Get Firebase user to check email verification status
    const firebaseUser = await auth.getUser(firebaseUID);

    if (!firebaseUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firebaseUser.emailVerified) {
      // Update MongoDB user verification status
      await User.findOneAndUpdate(
        { firebaseUID },
        { isVerified: true }
      );

      return res.status(200).json({ message: "Email verified successfully" });
    } else {
      return res.status(400).json({ 
        message: "Email not verified yet. Please check your inbox and click the verification link." 
      });
    }
  } catch (error) {
    console.log("Error in verifyOtp", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.firebaseUID) {
      return res.status(400).json({ 
        message: "Account needs migration. Use 'Forgot Password' to activate.",
        needsMigration: true
      });
    }

    // Check if already verified
    const firebaseUser = await auth.getUser(user.firebaseUID);
    if (firebaseUser.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new verification link
    const verificationLink = await auth.generateEmailVerificationLink(email);

    // Note: Frontend should use Firebase Client SDK to send actual email
    // This link is for backend testing/manual sending
    res.status(200).json({ 
      message: "Use the link below to verify your email (or sign in via frontend to auto-send)",
      verificationLink,
      requiresClientSend: true // Flag for frontend to use Client SDK
    });
  } catch (error) {
    console.log("Error in resendOtp", error);

    if (error.code === "auth/user-not-found") {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    //res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Loged Out Succesfully" });
  } catch (error) {
    console.log("Logout Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Return generic message for security (don't reveal if email exists)
      return res.status(200).json({ 
        message: "If the email exists, a password reset link has been sent." 
      });
    }

    // Generate password reset link
    const resetLink = await auth.generatePasswordResetLink(email);

    res.status(200).json({
      message: "Password reset link sent to " + email,
      resetLink, // Include for testing/frontend use
    });
  } catch (error) {
    console.log("Error in forgotPassword", error);

    if (error.code === "auth/user-not-found") {
      // Return generic message for security
      return res.status(200).json({ 
        message: "If the email exists, a password reset link has been sent." 
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in Chech Auth Controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
