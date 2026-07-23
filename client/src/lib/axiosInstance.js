import axios from 'axios';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

// Create a single axios instance that ALL API calls in the app should use.
// baseURL is set from the .env.local file so every request goes to our backend.
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR — runs BEFORE every API call.
// It reads the auth token from cookies and attaches it as a Bearer token
// so the backend knows which admin is making the request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(AUTH_COOKIE_NAME); // BUG FIX: was 'token', must match what AuthContext saves
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR — runs AFTER every API response.
// If the server says "401 Unauthorized" (token expired or invalid),
// we clear the cookie and send the user back to the login page.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove(AUTH_COOKIE_NAME); // BUG FIX: was 'token', must match the cookie name we set
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
