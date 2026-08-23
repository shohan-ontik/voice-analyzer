import { NextResponse } from "next/server";
import { ApiClientError, createPracticeSession, listOwnPracticeSessions } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";
import type { AnalysisCategory, TranscriptSegment } from "@/app/lib/analysis";

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

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    topicId?: string | null;
    topicName?: string;
    overall?: number;
    verdict?: string;
    categories?: AnalysisCategory[];
    transcript?: TranscriptSegment[];
  } | null;

  if (
    !body ||
    typeof body.topicName !== "string" ||
    !body.topicName ||
    typeof body.overall !== "number" ||
    typeof body.verdict !== "string" ||
    !Array.isArray(body.categories) ||
    !Array.isArray(body.transcript)
  ) {
    return NextResponse.json({ error: { message: "Missing or invalid session fields." } }, { status: 400 });
  }

  try {
    const saved = await createPracticeSession(token, {
      topicId: body.topicId ?? null,
      topicName: body.topicName,
      overall: body.overall,
      verdict: body.verdict,
      categories: body.categories,
      transcript: body.transcript,
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    if (err instanceof ApiClientError) {
      return NextResponse.json({ error: { message: err.message } }, { status: err.status });
    }
    console.error("Save session proxy failed:", err);
    return NextResponse.json({ error: { message: "Failed to save this session." } }, { status: 502 });
  }
}
