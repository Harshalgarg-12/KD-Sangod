import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "./constants";

const COOKIE_OPTIONS = {
  expires: 7,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export function setAuthToken(token) {
  Cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
}

export function getAuthToken() {
  return Cookies.get(AUTH_COOKIE_NAME) ?? null;
}

export function removeAuthToken() {
  Cookies.remove(AUTH_COOKIE_NAME, { path: "/" });
}
