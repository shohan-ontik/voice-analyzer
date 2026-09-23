// Mirrors voice-analyzer-api's User#toSafeJSON().
export type AppUser = {
  id: string;
  username: string;
  phone: string | null;
  email: string | null;
  name: string;
  role: "user" | "admin";
  isBanned: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  firstLoginAt: string | null;
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
  // Average overallScore across every session the caller has ever recorded.
  averageScore: number | null;
  // Modules where every chapter is completed and the exam is passed.
  completedModules: number;
  passedExams: number;
  // Pitches (non-exam sessions) left this calendar month, out of a cap of 125.
  pitchesRemainingThisMonth: number;
  // Total pitches (non-exam sessions) the caller has ever participated in.
  totalPitchesEvaluated: number;
};

// Mirrors a PracticeSession row from GET /practice-sessions and
// GET /practice-sessions/:id.
export type PracticeSessionRecord = {
  id: string;
  topicId: string | null;
  topicName: string;
  // Set when this session is a chapter roleplay practice or a graded module
  // exam attempt (mutually exclusive). Both null means an ad-hoc /record
  // pitch practice.
  chapterId: string | null;
  examId: string | null;
  type: "exam" | "pitch_practice";
  // Snapshotted at creation: the exam's Exam.passMark for a graded attempt,
  // or the flat pitch-practice pass mark otherwise. Compare overallScore
  // against this (not a frontend-guessed threshold) to know if it passed.
  passMark: number;
  overallScore: number;
  verdict: string;
  categories: { name: string; score: number; feedback: string; tips: string[] }[];
  transcript: { text: string; kind: "plain" | "filler" | "pronunciation" }[];
  createdAt: string;
  // Only populated by GET /practice-sessions/:id — resolves chapterId/examId
  // into the slugs needed to link back to the right roleplay/exam page.
  moduleSlug?: string | null;
  chapterSlug?: string | null;
};

export type ApiErrorBody = {
  error: { message: string; details?: unknown };
};

// Mirrors voice-analyzer-api's LearningMaterial model.
export type LearningMaterialType = "video" | "pdf" | "audio";

export type LearningMaterial = {
  id: string;
  type: LearningMaterialType;
  title: string;
  // e.g. "10 mins" for video/audio, "6 pages" for a pdf.
  meta: string;
  filename: string;
  // `completedAt` is the only completion signal — null means not completed.
  completedAt: string | null;
};

// Mirrors voice-analyzer-api's ModuleChapter#scenario (JSONB) — the AI
// roleplay scenario a rep practices against for a chapter.
export type PitchScenario = {
  clientInitials: string;
  clientName: string;
  clientTitle: string;
  objection: string;
  objective: string;
  criteria: string[];
};

// Mirrors GET /modules and GET /modules/:slug's chapter shape. `completedAt`
// is the only completion signal — null means not completed.
export type ModuleChapter = {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  scenario: PitchScenario;
  materials: LearningMaterial[];
  completedAt: string | null;
};

// `bestScore`/`passed` are derived server-side from the caller's own
// PracticeSession attempts against this exam — not stored fields.
export type ModuleExam = {
  id: string;
  slug: string;
  title: string;
  moduleLabel: string;
  scenario: string;
  passMark: number;
  dueDate: string | null;
  bestScore: number | null;
  passed: boolean;
};

// `progressPercent` is derived server-side: chapters make up 80% (split
// evenly across chapters, then across each chapter's materials) and the
// final exam makes up the remaining 20%, earned once it's passed.
export type TrainingModule = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  order: number;
  chapters: ModuleChapter[];
  exam: ModuleExam;
  chapterCount: number;
  completedChapterCount: number;
  progressPercent: number;
};

// Mirrors GET /modules's item shape — the list endpoint drops the full
// chapters/exam payload (fetched separately per-module, via TrainingModule,
// once a trainee opens one) and sends aggregate chapter counts instead.
export type TrainingModuleSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  order: number;
  chapterCount: number;
  completedChapterCount: number;
  progressPercent: number;
};

// Mirrors GET /modules/exams's item shape — one entry per module that has an
// exam, with its unlock/pass status pre-computed server-side (mirrors
// getExamStatus in app/lib/moduleProgress.ts, which the detail endpoint's
// full TrainingModule still needs to compute this locally).
export type ExamListItem = {
  moduleSlug: string;
  exam: ModuleExam;
  status: "passed" | "failed" | "ready" | "locked";
};
