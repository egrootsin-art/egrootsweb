import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const name = urlParams.get("name");
    const picture = urlParams.get("picture");
    const authProvider = urlParams.get("authProvider") || "google";

    if (!token || !name) {
      navigate("/login");
      return;
    }

    // Clear signup form data from sessionStorage if it exists
    sessionStorage.removeItem("signupFormData");

    // Store auth data using AuthContext
    setAuthData({
      token,
      user: {
        name,
        email: email || null,
        picture: picture || null,
        authProvider,
      },
    });

    // Redirect based on role (check email if available)
    if (email === "bharanidharan7502@gmail.com") {
      navigate("/admindashboard");
    } else {
      navigate("/");
    }
  }, [navigate, setAuthData]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Verifying your account...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
