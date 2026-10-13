import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, listModules } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";
import { isModuleStatus } from "@/app/lib/moduleProgress";

export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status");

  try {
    const result = await listModules(token, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      q: q || undefined,
      status: status && isModuleStatus(status) ? status : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    return apiErrorResponse(err, "Failed to load modules.");
  }
}
