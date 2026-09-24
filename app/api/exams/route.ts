import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, listExams } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");

  try {
    const result = await listExams(token, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    return apiErrorResponse(err, "Failed to load exams.");
  }
}
