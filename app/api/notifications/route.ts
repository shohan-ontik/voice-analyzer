import { NextResponse } from "next/server";
import { apiErrorResponse, listNotifications } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function GET(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  try {
    const result = await listNotifications(token, {
      page: searchParams.has("page") ? Number(searchParams.get("page")) : undefined,
      pageSize: searchParams.has("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    return apiErrorResponse(err, "Failed to load notifications.");
  }
}
