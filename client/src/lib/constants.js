// Party types used across the app for customers vs suppliers
export const PARTY_TYPES = { CUSTOMER: "CUSTOMER", SUPPLIER: "SUPPLIER" };
export const CUSTOMER_CATEGORIES = {
  SHOPKEEPER: "SHOPKEEPER",
  REGULAR: "REGULAR",
};

// The cookie name where we store the JWT auth token.
// This MUST be the same everywhere: AuthContext, axiosInstance, middleware.
export const AUTH_COOKIE_NAME = "kd_auth_token";

// Routes that require login — middleware will redirect to /login if no token
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/customers",
  "/suppliers",
  "/transactions",
  "/reports",
  "/profile",
  "/locations",
  "/add-admin", // BUG FIX: was missing — super-admin page needs protection too
];

// Public auth routes — if user is already logged in, redirect to /dashboard
export const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];
