import { NextResponse } from "next/server";
import { apiErrorResponse, markNotificationRead } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await markNotificationRead(token, id);
    return NextResponse.json(result);
  } catch (err) {
    return apiErrorResponse(err, "Failed to mark this notification as read.");
  }
}
