import "server-only";
import { NextResponse } from "next/server";
import type {
  AppUser,
  ApiErrorBody,
  ExamListItem,
  ExamSortBy,
  PracticeSessionRecord,
  SortOrder,
  StatsSummary,
  Topic,
  TrainingModule,
  TrainingModuleSummary,
} from "./types";
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

export function loginRequest(identifier: string, password: string, rememberMe = false) {
  return request<{ accessToken: string; user: AppUser; isFirstLogin: boolean }>("/auth/login", {
    method: "POST",
    body: { identifier, password, rememberMe },
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

export function listModules(token: string, params: { page?: number; pageSize?: number } = {}) {
  return request<{ items: TrainingModuleSummary[]; total: number }>("/modules", {
    token,
    searchParams: {
      page: params.page?.toString(),
      pageSize: params.pageSize?.toString(),
    },
  });
}

export function listExams(
  token: string,
  params: { page?: number; pageSize?: number; sortBy?: ExamSortBy; sortOrder?: SortOrder } = {}
) {
  return request<{ items: ExamListItem[]; total: number }>("/modules/exams", {
    token,
    searchParams: {
      page: params.page?.toString(),
      pageSize: params.pageSize?.toString(),
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    },
  });
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

export type HealthStatus = {
  // "up": backend and database healthy. "degraded": backend answered but
  // reports the database down (503). "down": backend unreachable or errored.
  status: "up" | "degraded" | "down";
  database: "up" | "down" | "unknown";
  httpStatus: number | null;
  latencyMs: number;
  checkedAt: string;
  error: string | null;
};

// Not built on request(): /healthz is unauthenticated and a 503 is a
// meaningful answer here, not an error to throw.
export async function checkHealth(): Promise<HealthStatus> {
  const started = performance.now();
  const checkedAt = new Date().toISOString();
  try {
    const res = await fetch(`${API_BASE_URL}/healthz`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Math.round(performance.now() - started);
    const body = (await res.json().catch(() => null)) as { ok?: boolean; database?: "up" | "down" } | null;
    const database = body?.database ?? "unknown";
    const status = res.ok && body?.ok ? "up" : res.status === 503 ? "degraded" : "down";
    return {
      status,
      database,
      httpStatus: res.status,
      latencyMs,
      checkedAt,
      error: status === "up" ? null : `হেলথ চেক স্ট্যাটাস ${res.status} দিয়েছে।`,
    };
  } catch (err) {
    return {
      status: "down",
      database: "unknown",
      httpStatus: null,
      latencyMs: Math.round(performance.now() - started),
      checkedAt,
      error: err instanceof Error && err.name === "TimeoutError" ? "৫ সেকেন্ডে কোনো সাড়া পাওয়া যায়নি।" : "সার্ভারে পৌঁছানো যায়নি।",
    };
  }
}
