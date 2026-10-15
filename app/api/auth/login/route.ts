import { NextResponse } from "next/server";
import { ApiClientError, loginRequest } from "@/app/lib/apiClient";
import { setSessionCookie } from "@/app/lib/session";

export async function POST(request: Request) {
  const { identifier, password, rememberMe } = (await request.json().catch(() => ({}))) as {
    identifier?: string;
    password?: string;
    rememberMe?: boolean;
  };

  if (!identifier || !password) {
    return NextResponse.json({ error: { message: "Username/phone and password are required." } }, { status: 400 });
  }

  try {
    const { accessToken, user, isFirstLogin } = await loginRequest(identifier, password, rememberMe === true);
    // This app is for reps only; admins use the separate admin panel. The
    // token is discarded without ever reaching a cookie.
    if (user.role !== "user") {
      return NextResponse.json(
        { error: { message: "অ্যাডমিন অ্যাকাউন্ট দিয়ে এখানে লগইন করা যাবে না। অ্যাডমিন প্যানেল ব্যবহার করুন।" } },
        { status: 403 }
      );
    }
    await setSessionCookie(accessToken, rememberMe === true);
    return NextResponse.json({ user, isFirstLogin });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json({ error: { message: err.message } }, { status: err.status });
    }
    console.error("Login proxy failed:", err);
    return NextResponse.json({ error: { message: "Login failed. Please try again." } }, { status: 502 });
  }
}
