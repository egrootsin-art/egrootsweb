import axios from "./axiosConfig.js";

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
// ✅ SEND OTP
export const sendOtp = async (email: string): Promise<AuthResponse> => {
  try {
    const res = await axios.post("/api/otp/send", { email });
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to send OTP" };
  }
};

// ✅ VERIFY OTP & REGISTER
export const verifyOtpAndRegister = async (payload: {
  name: string;
  email: string;
  password: string;
  otp: string;
}): Promise<AuthResponse> => {
  try {
    const res = await axios.post("/api/otp/verify", payload);
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "OTP verification failed" };
  }
};
