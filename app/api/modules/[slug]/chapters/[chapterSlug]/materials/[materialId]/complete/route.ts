import { revalidatePath } from "next/cache";
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
    // All materials in the chapter are now complete, which unlocks the next
    // chapter — revalidate the module page so a cached Router Cache entry
    // doesn't keep showing it locked.
    if (result.chapterCompleted) {
      revalidatePath(`/modules/${slug}`);
    }
    return NextResponse.json(result);
  } catch (err) {
    return apiErrorResponse(err, "Failed to mark this content as complete.");
  }
}
