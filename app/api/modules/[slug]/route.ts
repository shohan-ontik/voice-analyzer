import { NextResponse } from "next/server";
import { apiErrorResponse, getModule } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const trainingModule = await getModule(token, slug);
    return NextResponse.json(trainingModule);
  } catch (err) {
    return apiErrorResponse(err, "Failed to load this module.");
  }
}
