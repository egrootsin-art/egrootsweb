import React, { useState } from "react";
import { Eye, EyeOff, Lock, User, Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
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

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGoogleSignup = () => {
    // Validate form before proceeding
    if (!validateForm()) {
      setErrors({ general: "Please fill all fields correctly" });
      return;
    }

    // Prepare form data
    const formDataToStore = {
      name: formData.name.trim(),
      password: formData.password,
    };

    // Store form data in sessionStorage as backup
    sessionStorage.setItem("signupFormData", JSON.stringify(formDataToStore));

    // Encode form data as base64 for OAuth state parameter
    // This ensures the data is passed through Google OAuth flow
    try {
      const state = btoa(JSON.stringify(formDataToStore));
      console.log("📤 Sending form data via OAuth state:", { name: formDataToStore.name, hasPassword: !!formDataToStore.password });
      
      // Redirect to Google OAuth with state parameter
      window.location.href = `${backendUrl}/api/auth/google/login?state=${encodeURIComponent(state)}`;
    } catch (error) {
      console.error("Error encoding form data:", error);
      setErrors({ general: "Error preparing signup. Please try again." });
    }
  };

  // Check if form is valid for button enablement
  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.password.length >= 6 &&
    formData.confirmPassword === formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-1">
          Create Account
        </h2>

        <p className="text-gray-300 text-center mb-6 text-sm">
          Start your journey with us
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {errors.general && (
            <p className="text-red-500 bg-red-500/10 p-2 rounded-lg text-center text-sm">
              {errors.general}
            </p>
          )}

          {/* Name Field */}
          <div>
            <label className="text-gray-200 text-sm">Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-gray-300 h-5 w-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 py-3 rounded-lg bg-black/30 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                required
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-200 text-sm">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-300 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-black/30 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
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

          {/* Confirm Password Field */}
          <div>
            <label className="text-gray-200 text-sm">Confirm Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-300 h-5 w-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-black/30 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Re-enter password"
                required
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        </form>

        {/* Google Sign Up Button - Only enabled when form is valid */}
        <button
          onClick={handleGoogleSignup}
          disabled={!isFormValid || isLoading}
          className="w-full py-3 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 shadow hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white mt-6"
        >
          <Chrome className="w-5 h-5" /> Sign up with Google
        </button>

        {!isFormValid && (
          <p className="text-center text-xs text-gray-400 mt-2">
            Please fill all fields correctly to continue
          </p>
        )}

        {/* Login Link */}
        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 underline"
          >
            Sign In
          </button>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 mt-4">
          By signing up, you agree to our{" "}
          <button
            type="button"
            onClick={() => navigate("/terms")}
            className="text-blue-400 underline"
          >
            Terms & Conditions
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default Signup;

