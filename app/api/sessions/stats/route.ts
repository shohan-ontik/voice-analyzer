import { NextResponse } from "next/server";
import { apiErrorResponse, getOwnStatsSummary } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  try {
    const stats = await getOwnStatsSummary(token);
    return NextResponse.json(stats);
  } catch (err) {
    return apiErrorResponse(err, "Failed to load stats.");
  }
}
