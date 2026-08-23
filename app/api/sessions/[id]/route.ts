import { NextResponse } from "next/server";
import { ApiClientError, getOwnPracticeSession } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { id } = await params;

  try {
    const session = await getOwnPracticeSession(token, id);
    return NextResponse.json(session);
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json({ error: { message: err.message } }, { status: err.status });
    }
    console.error("Get session proxy failed:", err);
    return NextResponse.json({ error: { message: "Failed to load this session." } }, { status: 502 });
  }
}
