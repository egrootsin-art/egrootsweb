import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "@/api/auth";
import axios from "@/api/axiosConfig";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🔹 LOGIN
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

  // 🔹 SIGNUP (Now saves new user to backend)
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
