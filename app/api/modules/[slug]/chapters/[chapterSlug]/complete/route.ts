import { NextResponse } from "next/server";
import { apiErrorResponse, markChapterComplete } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string; chapterSlug: string }> }) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { slug, chapterSlug } = await params;

  try {
    const result = await markChapterComplete(token, slug, chapterSlug);
    return NextResponse.json(result);
  } catch (err) {
    return apiErrorResponse(err, "Failed to mark this chapter complete.");
  }
}
