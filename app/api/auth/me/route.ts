import { NextResponse } from "next/server";
import { apiErrorResponse, getMe } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  try {
    const user = await getMe(token);
    return NextResponse.json(user);
  } catch (err) {
    return apiErrorResponse(err, "Failed to load profile.");
  }
}
