import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./constants";

// Matches the backend access-token expiries (see voice-analyzer-server's
// services/auth.service.ts) so the cookie never outlives the JWT.
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const SESSION_REMEMBER_ME_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export async function setSessionCookie(token: string, rememberMe: boolean = false) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe ? SESSION_REMEMBER_ME_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}
