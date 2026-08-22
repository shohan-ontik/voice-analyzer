import { NextResponse } from "next/server";
import { ApiClientError, listActiveTopics } from "@/app/lib/apiClient";
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
    if (err instanceof ApiClientError) {
      return NextResponse.json({ error: { message: err.message } }, { status: err.status });
    }
    console.error("List topics proxy failed:", err);
    return NextResponse.json({ error: { message: "Failed to load topics." } }, { status: 502 });
  }
}
