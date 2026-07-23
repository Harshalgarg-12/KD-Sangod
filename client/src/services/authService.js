// authService.js — Handles all authentication API calls.
// Uses the shared axiosInstance so auth tokens are automatically attached.
import axiosInstance from "@/lib/axiosInstance";
import { setAuthToken, removeAuthToken } from "@/lib/cookies";

// Log in an existing admin with phone + password.
// On success, saves the JWT token to a cookie so future requests are authenticated.
export async function loginUser({ phone, password }) {
  const { data } = await axiosInstance.post("/auth/login", { phone, password });
  if (data?.success && data?.data?.token) {
    setAuthToken(data.data.token);
  }
  return data;
}

// Register a new admin account.
// The backend will hash the password and return a JWT token.
export async function signupUser(payload) {
  const { data } = await axiosInstance.post("/auth/signup", payload);
  if (data?.success && data?.data?.token) {
    setAuthToken(data.data.token);
  }
  return data;
}

// Request a password reset link (placeholder — backend route may not exist yet).
export async function forgotPasswordUser({ phone }) {
  const { data } = await axiosInstance.post("/auth/forgot-password", { phone });
  return data;
}

// Clear the auth cookie on logout.
export function logoutUser() {
  removeAuthToken();
}
