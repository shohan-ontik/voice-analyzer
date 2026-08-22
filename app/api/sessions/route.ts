import { NextResponse } from "next/server";
import { ApiClientError, listOwnPracticeSessions } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function GET(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  try {
    const result = await listOwnPracticeSessions(token, {
      page: searchParams.has("page") ? Number(searchParams.get("page")) : undefined,
      pageSize: searchParams.has("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json({ error: { message: err.message } }, { status: err.status });
    }
    console.error("List sessions proxy failed:", err);
    return NextResponse.json({ error: { message: "Failed to load history." } }, { status: 502 });
  }
}
