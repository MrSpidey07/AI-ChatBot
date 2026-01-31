import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import {
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Lock,
  Eye,
  EyeOff,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

const AuthAction = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState("");
  const [actionCode, setActionCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password reset states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const codeParam = searchParams.get("oobCode");

    if (!modeParam || !codeParam) {
      setError("Invalid or missing action parameters");
      setLoading(false);
      return;
    }

    setMode(modeParam);
    setActionCode(codeParam);

    // Handle different action modes
    if (modeParam === "verifyEmail") {
      handleEmailVerification(codeParam);
    } else if (modeParam === "resetPassword") {
      handlePasswordResetVerification(codeParam);
    } else if (modeParam === "recoverEmail") {
      setError("Email recovery is not yet supported");
      setLoading(false);
    } else {
      setError("Unknown action mode");
      setLoading(false);
    }
  }, [searchParams]);

  const handleEmailVerification = async (code) => {
    try {
      // Apply the email verification code
      await applyActionCode(auth, code);
      setSuccess(true);
      setLoading(false);
      toast.success("Email verified successfully!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Email verification error:", error);
      setLoading(false);

      if (error.code === "auth/invalid-action-code") {
        setError("This verification link is invalid or has already been used.");
      } else if (error.code === "auth/expired-action-code") {
        setError("This verification link has expired. Please request a new one.");
      } else {
        setError("Failed to verify email. Please try again.");
      }
    }
  };

  const handlePasswordResetVerification = async (code) => {
    try {
      // Verify the password reset code is valid
      await verifyPasswordResetCode(auth, code);
      setLoading(false);
      // Show password reset form
    } catch (error) {
      console.error("Password reset verification error:", error);
      setLoading(false);

      if (error.code === "auth/invalid-action-code") {
        setError("This password reset link is invalid or has already been used.");
      } else if (error.code === "auth/expired-action-code") {
        setError("This password reset link has expired. Please request a new one.");
      } else {
        setError("Invalid password reset link.");
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!strongPasswordRegex.test(newPassword)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setResettingPassword(true);

    try {
      // Confirm the password reset with the new password
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess(true);
      toast.success("Password reset successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Password reset error:", error);

      if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Use at least 8 characters.");
      } else if (error.code === "auth/invalid-action-code") {
        toast.error("Invalid or expired reset link");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      setResettingPassword(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="size-12 animate-spin text-primary mx-auto" />
          <p className="text-base-content/60">
            {mode === "verifyEmail" && "Verifying your email..."}
            {mode === "resetPassword" && "Verifying reset link..."}
            {!mode && "Processing..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="size-20 rounded-full bg-error/10 flex items-center justify-center">
                  <XCircle className="size-10 text-error" />
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <h2 className="card-title justify-center text-2xl">
                  Action Failed
                </h2>
                <p className="text-base-content/60">{error}</p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {mode === "verifyEmail" && (
                  <button
                    onClick={() => navigate("/register")}
                    className="btn btn-primary w-full"
                  >
                    Back to Registration
                  </button>
                )}
                {mode === "resetPassword" && (
                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="btn btn-primary w-full"
                  >
                    Request New Reset Link
                  </button>
                )}
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-outline w-full"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state (Email Verification)
  if (success && mode === "verifyEmail") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="size-20 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="size-10 text-success" />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h2 className="card-title justify-center text-2xl">
                  Email Verified!
                </h2>
                <p className="text-base-content/60">
                  Your email has been successfully verified. You can now login to your account.
                </p>
              </div>

              {/* Redirect Notice */}
              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm">Redirecting to login in 3 seconds...</span>
              </div>

              {/* Manual Action */}
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary w-full"
              >
                Go to Login Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password Reset Form
  if (mode === "resetPassword" && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Set New Password</h1>
              <p className="text-base-content/60">
                Enter your new password below
              </p>
            </div>
          </div>

          {/* Password Reset Form */}
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">New Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={resettingPassword}
            >
              {resettingPassword ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Success state (Password Reset)
  if (success && mode === "resetPassword") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-6">
              <div className="flex justify-center">
                <div className="size-20 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="size-10 text-success" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="card-title justify-center text-2xl">
                  Password Reset Complete!
                </h2>
                <p className="text-base-content/60">
                  Your password has been successfully reset. You can now login with your new password.
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary w-full"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthAction;
