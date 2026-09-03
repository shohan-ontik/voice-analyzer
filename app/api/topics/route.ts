import { NextResponse } from "next/server";
import { apiErrorResponse, listActiveTopics } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  try {
    const result = await listActiveTopics(token);
    return NextResponse.json(result);
  } catch (err) {
    return apiErrorResponse(err, "Failed to load topics.");
  }
}
