import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const token = urlParams.get("token");
    const email = urlParams.get("email");
    const name = urlParams.get("name");
    const picture = urlParams.get("picture");

    if (!token) {
      navigate("/login");
      return;
    }

    // Store token & user
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        email,
        name,
        picture,
      })
    );

    // Redirect based on role
    if (email === "bharanidharan7502@gmail.com") {
      navigate("/admindashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Verifying your Google account...
    </div>
  );
};

export default AuthSuccess;
