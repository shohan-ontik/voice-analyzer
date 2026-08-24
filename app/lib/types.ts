// Mirrors voice-analyzer-api's User#toSafeJSON().
export type AppUser = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  isBanned: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

// Mirrors voice-analyzer-api's Topic model — an admin-managed practice
// scenario (name + the key facts, in Bangla, the pitch should cover —
// not a script to recite verbatim).
export type Topic = {
  id: string;
  name: string;
  passage: string;
  isActive: boolean;
};

// Mirrors GET /practice-sessions/stats/summary.
export type StatsSummary = {
  lastScore: number | null;
  lastSessionAt: string | null;
  sessionsThisWeek: number;
  averageScoreThisWeek: number | null;
  totalSessions: number;
};

// Mirrors a PracticeSession row from GET /practice-sessions and
// GET /practice-sessions/:id.
export type PracticeSessionRecord = {
  id: string;
  topicId: string | null;
  topicName: string;
  overallScore: number;
  verdict: string;
  categories: { name: string; score: number; feedback: string; tips: string[] }[];
  transcript: { text: string; kind: "plain" | "filler" | "pronunciation" }[];
  createdAt: string;
};

export type ApiErrorBody = {
  error: { message: string; details?: unknown };
};
