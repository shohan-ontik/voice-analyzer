import "server-only";
import { NextResponse } from "next/server";
import type { AppUser, ApiErrorBody, PracticeSessionRecord, StatsSummary, Topic, TrainingModule } from "./types";
import type { AnalysisCategory, TranscriptSegment } from "./analysis";
import { clearSessionCookie } from "./session";

export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api/v1";

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

// Shared catch-block for route handlers that call the backend with a
// session token. A 401 here means the backend rejected the token itself
// (expired/revoked), not just a missing cookie, so clear it — otherwise the
// stale cookie keeps passing proxy.ts's optimistic presence check and the
// user gets stuck seeing "Not authenticated." instead of being sent to login.
export async function apiErrorResponse(err: unknown, fallbackMessage: string) {
  if (err instanceof ApiClientError) {
    if (err.status === 401) await clearSessionCookie();
    return NextResponse.json({ error: { message: err.message } }, { status: err.status });
  }
  console.error(fallbackMessage, err);
  return NextResponse.json({ error: { message: fallbackMessage } }, { status: 502 });
}

async function request<T>(
  path: string,
  options: { method?: string; token?: string | null; body?: unknown; searchParams?: Record<string, string | undefined> } = {}
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiClientError(res.status, body?.error?.message ?? `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function loginRequest(identifier: string, password: string) {
  return request<{ accessToken: string; user: AppUser; isFirstLogin: boolean }>("/auth/login", {
    method: "POST",
    body: { identifier, password },
  });
}

export function getMe(token: string) {
  return request<AppUser>("/auth/me", { token });
}

export function listActiveTopics(token: string) {
  return request<{ items: Topic[] }>("/topics", { token });
}

export function listActiveScoreCategoryNames(token: string) {
  return request<{ items: { name: string }[] }>("/score-categories", { token });
}

export function createPracticeSession(
  token: string,
  input: {
    topicId: string | null;
    topicName: string;
    chapterId?: string | null;
    examId?: string | null;
    overall: number;
    verdict: string;
    categories: AnalysisCategory[];
    transcript: TranscriptSegment[];
  }
) {
  return request<PracticeSessionRecord>("/practice-sessions", { method: "POST", token, body: input });
}

export function listOwnPracticeSessions(token: string, params: { page?: number; pageSize?: number } = {}) {
  return request<{ items: PracticeSessionRecord[]; total: number }>("/practice-sessions", {
    token,
    searchParams: {
      page: params.page?.toString(),
      pageSize: params.pageSize?.toString(),
    },
  });
}

export function getOwnPracticeSession(token: string, id: string) {
  return request<PracticeSessionRecord>(`/practice-sessions/${id}`, { token });
}

export function getOwnStatsSummary(token: string) {
  return request<StatsSummary>("/practice-sessions/stats/summary", { token });
}

export function changePassword(token: string, input: { currentPassword: string; newPassword: string }) {
  return request<{ success: true }>("/auth/me/password", { method: "PATCH", token, body: input });
}

export function listModules(token: string) {
  return request<{ items: TrainingModule[] }>("/modules", { token });
}

export function getModule(token: string, slug: string) {
  return request<TrainingModule>(`/modules/${encodeURIComponent(slug)}`, { token });
}

export function markMaterialComplete(token: string, moduleSlug: string, chapterSlug: string, materialId: string) {
  return request<{ completed: true; completedAt: string; chapterCompleted: boolean }>(
    `/modules/${encodeURIComponent(moduleSlug)}/chapters/${encodeURIComponent(chapterSlug)}/materials/${encodeURIComponent(materialId)}/complete`,
    { method: "POST", token }
  );
}
