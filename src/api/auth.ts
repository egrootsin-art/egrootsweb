import axios from "./axiosConfig";

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: any;
  error?: string;
}

// SIGNUP (Local - Name + Password only)
export const signupUser = async (
  name: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post("/api/auth/signup", { name, password });
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Signup Failed" };
  }
};

// LOGIN (Local - Name + Password)
export const loginUser = async (
  name: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post("/api/auth/login", { name, password });
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Login Failed" };
  }
};
