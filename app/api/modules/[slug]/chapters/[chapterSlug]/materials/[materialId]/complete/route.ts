import { NextResponse } from "next/server";
import { apiErrorResponse, markMaterialComplete } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string; chapterSlug: string; materialId: string }> }
) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { slug, chapterSlug, materialId } = await params;

  try {
    const result = await markMaterialComplete(token, slug, chapterSlug, materialId);
    return NextResponse.json(result);
  } catch (err) {
    return apiErrorResponse(err, "Failed to mark this content as complete.");
  }
}
