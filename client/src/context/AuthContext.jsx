"use client"; // This tells Next.js to run this component only in the browser (client-side)

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axiosInstance from '@/lib/axiosInstance';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

// Create a Context object. Think of Context as a global variable store for your React app.
// It allows us to share the logged-in admin's data across any component without passing props manually.
const AuthContext = createContext({
  admin: null,
  loading: true,
  login: async () => { },
  logout: () => { },
  refreshProfile: async () => { },
});

// Provides the auth state to the rest of the app. Wraps the whole app in Providers.jsx.
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); // Stores the current logged-in user
  const [loading, setLoading] = useState(true); // Shows a loader while we check if the user is logged in

  // Fetches the admin's profile from the backend using their saved token
  const fetchProfile = async () => {
    try {
      // Because we use axiosInstance, the token in the cookie is automatically attached to this request
      const { data } = await axiosInstance.get('/admin/profile');
      if (data.success) {
        setAdmin(data.data);
      } else {
        // If the token is invalid or expired, remove the cookie
        Cookies.remove(AUTH_COOKIE_NAME);
        setAdmin(null);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      Cookies.remove(AUTH_COOKIE_NAME);
      setAdmin(null);
    } finally {
      // Stop showing the loader once we finish checking
      setLoading(false);
    }
  };

  // useEffect runs once when the app first loads. It checks if there's a saved token.
  useEffect(() => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    if (token) {
      fetchProfile(); // If token exists, try to get the user's details
    } else {
      setLoading(false); // If no token, they are not logged in
    }
  }, []);

  // Called when the user clicks "Sign In" on the login page
  const login = async ({ phone, password, rememberMe }) => {
    try {
      setLoading(true);
      // Send phone and password to the backend
      const { data } = await axiosInstance.post('/auth/login', { phone, password });

      if (data.success) {
        const { token, admin: loggedAdmin } = data.data;
        // If they checked "remember me", keep them logged in for 7 days, else 1 day.
        const expiry = rememberMe ? 7 : 1;

        // Save the JWT token in a cookie right away so it can be used by the browser
        Cookies.set(AUTH_COOKIE_NAME, token, { expires: expiry, path: '/' });
        setAdmin(loggedAdmin); // Update our global state

        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Called when user clicks "Logout"
  const logout = () => {
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' }); // Delete the token cookie
    setAdmin(null); // Clear state
    // Force redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  // Updates the profile in state when changes are made (like editing their shop name)
  const refreshProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/profile');
      if (data.success) {
        setAdmin(data.data);
      }
    } catch (error) {
      console.error('Could not refresh profile', error);
    }
  };

  // The 'value' prop is what any component can access via useAuth()
  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so any component can easily access auth data
// Example: const { admin, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

