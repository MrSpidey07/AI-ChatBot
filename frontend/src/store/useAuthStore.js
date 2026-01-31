import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  firebaseUser: null,

  // Initialize auth state listener
  initializeAuthListener: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get Firebase ID token
          const idToken = await user.getIdToken();

          // Store token in localStorage
          localStorage.setItem("firebaseToken", idToken);

          // Sync with backend to get MongoDB user data
          const res = await axiosInstance.post("/auth/login", { idToken });

          set({
            authUser: res.data.user,
            firebaseUser: user,
            isCheckingAuth: false,
          });
        } catch (error) {
          console.error("Error syncing with backend:", error);
          set({ authUser: null, firebaseUser: null, isCheckingAuth: false });
        }
      } else {
        localStorage.removeItem("firebaseToken");
        set({ authUser: null, firebaseUser: null, isCheckingAuth: false });
      }
    });
  },

  checkAuth: async () => {
    try {
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        set({ authUser: null, isCheckingAuth: false });
        return;
      }

      // Get fresh Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Verify token with backend
      const res = await axiosInstance.post("/auth/login", { idToken });
      set({ authUser: res.data.user, firebaseUser });
    } catch (error) {
      set({ authUser: null, firebaseUser: null });
      localStorage.removeItem("firebaseToken");
      console.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      // 1. Send credentials to backend (backend checks MongoDB first, then creates Firebase user)
      const backendResponse = await axiosInstance.post("/auth/signup", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      // Check if migration is needed
      if (backendResponse.data.needsMigration) {
        toast.error(
          "Account exists. Please use 'Forgot Password' to activate your account."
        );
        set({ isSigningUp: false });
        return;
      }

      // 2. Backend created Firebase user and MongoDB record
      // Now use Client SDK to sign in and send verification email
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 3. Send email verification using Firebase Client SDK (automatic email!)
      await sendEmailVerification(userCredential.user);

      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );

      // Don't auto-login until email is verified
      await signOut(auth);
      set({ authUser: null, firebaseUser: null });
    } catch (error) {
      console.error("Signup error:", error);

      // Handle backend errors
      if (error.response?.data?.needsMigration) {
        toast.error(
          "Account exists. Please use 'Forgot Password' to migrate your account."
        );
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email format");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        toast.error(
          "Please verify your email before logging in. Check your inbox for the verification link."
        );
        await signOut(auth);
        set({ authUser: null, firebaseUser: null, isLoggingIn: false });
        return;
      }

      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // Send to backend to get MongoDB user data
      const res = await axiosInstance.post("/auth/login", { idToken });

      set({ authUser: res.data.user, firebaseUser: userCredential.user });
      localStorage.setItem("firebaseToken", idToken);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);

      // Handle Firebase-specific errors
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("firebaseToken");
      set({ authUser: null, firebaseUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  },

  resendVerificationEmail: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("No user logged in");
        return;
      }

      await sendEmailVerification(user);
      toast.success("Verification email sent! Check your inbox.");
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("Error sending verification email");
    }
  },

  forgotPassword: async (email) => {
    try {
      // Use Firebase SDK to send password reset email (automatic!)
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      return true;
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Error sending password reset email");
      }
      throw error;
    }
  },

  resendOtp: async (email) => {
    try {
      // For resending OTP during registration, we need to sign in first
      // This assumes user has credentials (they just registered)
      // Alternative: Use backend endpoint to generate link
      
      const response = await axiosInstance.post("/auth/resend-otp", { email });
      
      if (response.data.verificationLink) {
        toast.success("Verification email sent! Check your inbox.");
        return response.data;
      }
    } catch (error) {
      console.error("Resend OTP error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error sending verification email");
      }
      throw error;
    }
  },
}));
