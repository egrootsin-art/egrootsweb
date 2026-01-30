import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "@/api/axiosConfig";
import { signupUser, loginUser } from "@/api/auth";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setAuthData: (data: { token: string; user: any }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on first mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      // Set token in axios defaults
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // If user data is corrupted, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
      }
    }
    setLoading(false);

    // Listen for token expiration events
    const handleTokenExpired = () => {
      setUser(null);
    };
    window.addEventListener("token-expired", handleTokenExpired);
    return () => {
      window.removeEventListener("token-expired", handleTokenExpired);
    };
  }, []);

  // SIGNUP (Local - Name + Email + Password)
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const res = await signupUser(name, email, password);

    if (res.token && res.user) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
      setUser(res.user);
      return true;
    }
    return false;
  };

  // LOGIN (Local - Email + Password)
  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await loginUser(email, password);

    if (res.token && res.user) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
      setUser(res.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Set auth data after successful Google OAuth callback
  const setAuthData = (data: { token: string; user: any }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
