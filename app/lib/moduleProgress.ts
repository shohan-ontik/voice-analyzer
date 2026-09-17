// Derives module- and exam-level progress from real per-user data (chapter
// completion + exam attempts) returned by the API, instead of trusting
// hand-set status fields that can drift out of sync with what they
// summarize.

import type { LearningMaterial, TrainingModule } from "./types";

export type ModuleStatus = "completed" | "in_progress" | "not_started";
export type ExamStatus = "passed" | "failed" | "ready" | "locked";
export type ChapterStatus = "completed" | "unlocked" | "locked";
export type MaterialStatus = "completed" | "unlocked" | "locked";

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
// "passed" once a passing attempt exists. Once unlocked, an attempt that
// didn't reach the pass mark (a `bestScore` with no passing attempt) shows as
// "failed" rather than reverting to "ready", so the trainee sees their result
// instead of a blank slate.
export function getExamStatus(trainingModule: TrainingModule): ExamStatus {
  if (trainingModule.exam.passed) return "passed";
  const { completed, total } = getChapterProgress(trainingModule);
  if (total === 0 || completed < total) return "locked";
  return trainingModule.exam.bestScore !== null ? "failed" : "ready";
}

// A chapter is locked until every chapter before it (in array order) is
// completed — the first chapter is always at least unlocked.
export function getChapterStatus(trainingModule: TrainingModule, chapterIndex: number): ChapterStatus {
  const chapter = trainingModule.chapters[chapterIndex];
  if (chapter.completedAt !== null) return "completed";

  const previousChapter = trainingModule.chapters[chapterIndex - 1];
  if (previousChapter?.completedAt === null) return "locked";
  return "unlocked";
}

// A material (lesson) within a chapter is locked until every material before
// it, within the same chapter, is completed.
export function getMaterialStatus(materials: LearningMaterial[], materialIndex: number): MaterialStatus {
  const material = materials[materialIndex];
  if (material.completedAt !== null) return "completed";

  const previousMaterial = materials[materialIndex - 1];
  if (previousMaterial?.completedAt === null) return "locked";
  return "unlocked";
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
