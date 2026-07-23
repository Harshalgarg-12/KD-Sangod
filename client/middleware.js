import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, AUTH_ROUTES, PROTECTED_ROUTES } from "./src/lib/constants";

// Helper function to check if the current page requires the user to be logged in
function isProtectedPath(pathname) {
  // Checks if the URL matches exactly or starts with the route (e.g. /customers or /customers/add)
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Helper function to check if the current page is an auth page (login, signup, etc.)
function isAuthPath(pathname) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Next.js Middleware — this runs on the edge server BEFORE every request.
// It intercepts page loads and API calls to enforce route protection.
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Try to find the JWT token in the user's cookies. 
  // If no token exists, it means they are not logged in.
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // RULE 1: If trying to access a secure page WITHOUT a token, send them to /login
  if (isProtectedPath(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // Append '?from=/dashboard' so we can redirect them back after they login
    return NextResponse.redirect(loginUrl);
  }

  // RULE 2: If trying to access an auth page (like /login) WITH a token, send them straight to /dashboard
  // (Because logged-in users don't need to log in again)
  if (isAuthPath(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // RULE 3: Allow the request to proceed normally if it doesn't violate rules 1 & 2
  return NextResponse.next();
}

// The matcher tells Next.js WHICH paths should run through this middleware.
// This optimizes performance so public assets like images aren't checked unnecessarily.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/suppliers/:path*",
    "/transactions/:path*",
    "/reports/:path*",
    "/profile/:path*",
    "/add-admin/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ],
};
