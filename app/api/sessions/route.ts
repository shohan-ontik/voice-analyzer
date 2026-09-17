import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiErrorResponse, createPracticeSession, listOwnPracticeSessions } from "@/app/lib/apiClient";
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
    return apiErrorResponse(err, "Failed to load history.");
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
    chapterId?: string | null;
    examId?: string | null;
    // Not forwarded to the backend — used only to know which module page to
    // revalidate below when this session is a graded exam attempt.
    moduleSlug?: string | null;
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
      chapterId: body.chapterId ?? null,
      examId: body.examId ?? null,
      overall: body.overall,
      verdict: body.verdict,
      categories: body.categories,
      transcript: body.transcript,
    });

    // An exam attempt can be the one that pushes the module to "completed"
    // (all chapters done + a passing exam score) — revalidate its page so a
    // cached Router Cache entry doesn't keep showing it as in-progress.
    if (body.examId && body.moduleSlug) {
      revalidatePath(`/modules/${body.moduleSlug}`);
    }

    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    return apiErrorResponse(err, "Failed to save this session.");
  }
}
