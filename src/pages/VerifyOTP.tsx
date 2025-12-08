import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpAndRegister, sendOtp } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, ArrowLeft } from "lucide-react";

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthData } = useAuth();

  const { fullName, email, password } =
    (location.state as {
      fullName: string;
      email: string;
      password: string;
    }) || {};

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  // Redirect if no email/password
  useEffect(() => {
    if (!email || !password || !fullName) {
      navigate("/login");
    }
  }, [email, password, fullName, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle OTP input change
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((d) => d === "")) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const otpCode = otp.join("");
      const res = await verifyOtpAndRegister({
        name: fullName,
        email,
        password,
        otp: otpCode,
      });

      if (res.token && res.user) {
        // Save auth data
        setAuthData({ token: res.token, user: res.user });

        // Redirect based on email
        if (email === "admin@egroots.com") {
          navigate("/admindashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(res.error || "OTP verification failed");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid or expired OTP";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setError(null);

    try {
      const res = await sendOtp(email);
      if (res.message && !res.error) {
        setTimeLeft(120);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(res.error || "Failed to resend OTP");
      }
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Format timer
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-300 text-sm">
            Enter the 6-digit code sent to
          </p>
          <p className="text-blue-400 font-semibold">{email}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-center text-sm mb-4">
            {error}
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl font-semibold bg-black/40 text-white border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Timer / Resend */}
          <div className="text-center text-sm">
            {!canResend ? (
              <p className="text-gray-300">
                Time remaining:{" "}
                <span className="font-mono text-blue-400 font-semibold">
                  {minutes}:{seconds}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-blue-400 underline hover:text-blue-300 disabled:opacity-60 transition"
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Verify & Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
