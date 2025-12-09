import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { signupUser } from "@/api/auth";
import { sendOtp } from "@/api/auth";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  general?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";

    if (!isLogin) {
      if (!formData.fullName) newErrors.fullName = "Full name required";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm password required";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/api/auth/google/login";
};





  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);

  try {
    let success = false;

    if (isLogin) {
      // ✅ LOGIN FLOW (unchanged)
      success = await login(formData.email, formData.password);
    } else {
      // ✅ NEW: OTP FLOW FOR SIGN UP
      const res = await sendOtp(formData.email);

      if (res.message && !res.error) {
        // Navigate to OTP page with data
        navigate("/verify-otp", {
          state: {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          },
        });
        return; // Stop here, no login yet
      } else {
        setErrors({ general: res.error || "Failed to send OTP" });
      }
    }

    // Only for login
    if (success && isLogin) {
      if (formData.email === "admin@egroots.com") {
        navigate("/admindashboard");
      } else {
        navigate("/");
      }
    }
  } catch {
    setErrors({ general: "Something went wrong" });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">

       <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-1">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-gray-300 text-center mb-6 text-sm">
          {isLogin ? "Sign in to continue" : "Start your journey"}
        </p>

        {/* GOOGLE LOGIN ONLY IN SIGN IN */}
        {isLogin && (
          <>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 shadow hover:bg-gray-200 transition"
            >
              <Chrome className="w-5 h-5" /> Sign in with Google
            </button>

            <div className="relative my-6">
              <div className="border-t border-white/20"></div>
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-black px-3 text-gray-300 text-sm">
                or
              </span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <p className="text-red-500 bg-red-500/10 p-2 rounded-lg text-center text-sm">
              {errors.general}
            </p>
          )}

          {!isLogin && (
            <div>
              <label className="text-gray-200 text-sm">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-gray-300 h-5 w-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 py-3 rounded-lg bg-black/30 text-white border border-white/30"
                  placeholder="Your full name"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label className="text-gray-200 text-sm">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-300 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 py-3 rounded-lg bg-black/30 text-white border border-white/30"
                placeholder="you@gmail.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-gray-200 text-sm">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-300 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-black/30 text-white border border-white/30"
                placeholder="Enter password"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="text-gray-200 text-sm">Confirm Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-300 h-5 w-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-black/30 text-white border border-white/30"
                  placeholder="Re-enter password"
                />
                <div
                  className="absolute right-3 top-3 cursor-pointer text-gray-300"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold shadow-lg"
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-4">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-400 underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-400 underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
