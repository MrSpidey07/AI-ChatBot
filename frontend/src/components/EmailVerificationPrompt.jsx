import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Mail, RefreshCw } from "lucide-react";

const EmailVerificationPrompt = ({ email }) => {
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { resendOtp } = useAuthStore();

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendOtp(email);
    } catch (error) {
      toast.error("Failed to resend verification email");
      console.error("Error resending OTP:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="size-20 rounded-full bg-warning/10 flex items-center justify-center">
                <Mail className="size-10 text-warning" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="card-title justify-center text-2xl">
                Verify Your Email
              </h2>
              <p className="text-base-content/60">
                We've sent a verification link to:
              </p>
              <p className="font-medium text-primary">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-base-200 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm font-medium">Next steps:</p>
              <ol className="text-sm text-base-content/70 space-y-1 list-decimal list-inside">
                <li>Open your email inbox</li>
                <li>Find the email from AI ChatBot</li>
                <li>Click the verification link</li>
                <li>Return here to login</li>
              </ol>
            </div>

            {/* Resend Button */}
            <div className="space-y-2">
              <p className="text-sm text-base-content/60">
                Didn't receive the email?
              </p>
              <button
                onClick={handleResend}
                disabled={isResending}
                className="btn btn-outline btn-sm"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4" />
                    Resend Verification Email
                  </>
                )}
              </button>
            </div>

            {/* Tips */}
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
              <span className="text-sm">Check your spam folder if you don't see the email</span>
            </div>

            {/* Action Button */}
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
};

export default EmailVerificationPrompt;
