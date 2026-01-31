import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Loader2, Mail, MessageSquare, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    try {
      const { forgotPassword } = useAuthStore.getState();
      await forgotPassword(email);
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="size-20 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="size-10 text-success" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Check Your Email</h1>
              <p className="text-base-content/60">
                We&apos;ve sent a password reset link to
              </p>
              <p className="font-medium text-primary">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-base-200 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm text-base-content/80">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-base-content/70 space-y-1 list-decimal list-inside">
                <li>Open your email inbox</li>
                <li>Click the password reset link</li>
                <li>Set your new password</li>
                <li>Login with your new password</li>
              </ol>
            </div>

            {/* Note */}
            <p className="text-sm text-base-content/60">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="link link-primary"
              >
                try again
              </button>
            </p>

            {/* Back to Login */}
            <Link to="/login" className="btn btn-outline w-full">
              <ArrowLeft className="size-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Forgot Password?</h1>
            <p className="text-base-content/60">
              No worries! Enter your email and we&apos;ll send you reset instructions.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link to="/login" className="link link-primary inline-flex items-center gap-1">
            <ArrowLeft className="size-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
