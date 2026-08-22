import "server-only";
import type { AppUser, ApiErrorBody, PracticeSessionRecord, StatsSummary, Topic } from "./types";
import type { AnalysisCategory, TranscriptSegment } from "./analysis";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api/v1";

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
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

export function loginRequest(email: string, password: string) {
  return request<{ accessToken: string; user: AppUser }>("/auth/login", {
    method: "POST",
    body: { email, password },
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

export function getOwnStatsSummary(token: string) {
  return request<StatsSummary>("/practice-sessions/stats/summary", { token });
}
