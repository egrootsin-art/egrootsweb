import axios from "./axiosConfig";

export interface AuthResponse {
  message?: string;
  token?: string;
  user?: any;
  error?: string;
}

// SIGNUP
export const signupUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post("/api/auth/signup", { name, email, password });
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Signup Failed" };
  }
};


// LOGIN
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post("/api/auth/login", { email, password });
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Login Failed" };
  }
};
