// Derives module- and exam-level progress from real per-user data (chapter
// completion + exam attempts) returned by the API, instead of trusting
// hand-set status fields that can drift out of sync with what they
// summarize.

import type { TrainingModule } from "./types";

export type ModuleStatus = "completed" | "in_progress" | "not_started";
export type ExamStatus = "passed" | "ready" | "locked";

export function getChapterProgress(trainingModule: TrainingModule): { completed: number; total: number } {
  const total = trainingModule.chapters.length;
  const completed = trainingModule.chapters.filter((c) => c.completedAt !== null).length;
  return { completed, total };
}

// A module is only "completed" once every chapter is completed AND its exam
// is passed — finishing all chapters with the exam still pending stays
// "in_progress".
export function getModuleStatus(trainingModule: TrainingModule): ModuleStatus {
  const { completed, total } = getChapterProgress(trainingModule);

  if (completed === total && trainingModule.exam.passed) return "completed";
  if (completed === 0) return "not_started";
  return "in_progress";
}

// An exam unlocks once every chapter in its module is completed, and stays
// "passed" once a passing attempt exists.
export function getExamStatus(trainingModule: TrainingModule): ExamStatus {
  if (trainingModule.exam.passed) return "passed";
  const { completed, total } = getChapterProgress(trainingModule);
  return total > 0 && completed === total ? "ready" : "locked";
}

// The next chapter a trainee should work on — the first one, in order, that
// isn't completed yet. Null once every chapter is done (the exam is what's
// left).
export function getCurrentChapter(trainingModule: TrainingModule) {
  return trainingModule.chapters.find((c) => c.completedAt === null) ?? null;
}

// Picks the module the homepage's "continue learning" card should highlight:
// the first in-progress module (by order), falling back to the first
// not-yet-started one. Null once every module is completed, or there are
// none at all.
export function pickContinueModule(modules: TrainingModule[]): TrainingModule | null {
  const inProgress = modules.find((m) => getModuleStatus(m) === "in_progress");
  if (inProgress) return inProgress;
  return modules.find((m) => getModuleStatus(m) === "not_started") ?? null;
}
