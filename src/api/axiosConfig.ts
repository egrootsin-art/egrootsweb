import axios from "axios";

// Dynamically determine the backend URL based on current origin
const getBackendURL = () => {
  // In development mode, use proxy (empty baseURL since paths already include /api)
  if (import.meta.env.MODE === "development") {
    return ""; // Empty because all API calls already include /api prefix
  }

  // In production, check if we're on localhost or domain
  const currentOrigin = window.location.origin;
  const isLocalhost = currentOrigin.includes("localhost") || currentOrigin.includes("127.0.0.1");

  // Always use HTTP for localhost (backend doesn't have SSL)
  if (isLocalhost) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    // Ensure HTTP for localhost
    return backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1")
      ? backendUrl.replace(/^https:/, "http:")
      : backendUrl;
  } else {
    // For domain, use env variable or construct from current origin
    if (import.meta.env.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
    // Fallback: use same protocol as current origin for domain
    return `${currentOrigin.replace(/:\d+$/, "")}:5000`;
  }
};

const baseURL = getBackendURL();

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      const token = localStorage.getItem("token");
      if (token) {
        // Only clear if we had a token (means it expired)
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        // Dispatch event to notify AuthContext
        window.dispatchEvent(new CustomEvent("token-expired"));
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
