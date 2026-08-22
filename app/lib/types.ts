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
// scenario (name + the Bangla passage to read aloud).
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

// Mirrors a PracticeSession row from GET /practice-sessions.
export type PracticeSessionRecord = {
  id: string;
  topicId: string | null;
  topicName: string;
  overallScore: number;
  verdict: string;
  categories: { name: string; score: number; feedback: string; tips: string[] }[];
  createdAt: string;
};

export type ApiErrorBody = {
  error: { message: string; details?: unknown };
};
