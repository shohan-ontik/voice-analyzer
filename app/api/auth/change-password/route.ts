import { NextResponse } from "next/server";
import { ApiClientError, changePassword } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function PATCH(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { currentPassword, newPassword } = (await request.json().catch(() => ({}))) as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: { message: "Current and new password are required." } },
      { status: 400 }
    );
  }

  try {
    const result = await changePassword(token, { currentPassword, newPassword });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json({ error: { message: err.message } }, { status: err.status });
    }
    console.error("Change password proxy failed:", err);
    return NextResponse.json({ error: { message: "Failed to change password." } }, { status: 502 });
  }
}
