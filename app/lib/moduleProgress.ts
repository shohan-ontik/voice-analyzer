// Derives module- and exam-level progress from real per-user data (chapter
// completion + exam attempts) returned by the API, instead of trusting
// hand-set status fields that can drift out of sync with what they
// summarize.

import type { LearningMaterial, ModuleExam, TrainingModule, TrainingModuleSummary } from "./types";

export const MODULE_STATUSES = ["completed", "in_progress", "not_started"] as const;
export type ModuleStatus = (typeof MODULE_STATUSES)[number];
export type ExamStatus = "passed" | "failed" | "ready" | "locked";
export type ChapterStatus = "completed" | "in_progress" | "unlocked" | "locked";
export type MaterialStatus = "completed" | "unlocked" | "locked";

export function getChapterProgress(trainingModule: TrainingModule): { completed: number; total: number } {
  const total = trainingModule.chapters.length;
  const completed = trainingModule.chapters.filter((c) => c.completedAt !== null).length;
  return { completed, total };
}

// A module is only "completed" once its progressPercent hits 100 — which,
// by the backend's formula (chapters 80% + exams 20% shared), only happens
// once every chapter is completed AND every exam is passed. Any progress above 0%
// (a chapter fully done, or even a single material within one) counts as
// "in_progress". Works for both the list summary and the full detail shape,
// since both carry progressPercent.
export function isModuleStatus(value: string): value is ModuleStatus {
  return (MODULE_STATUSES as readonly string[]).includes(value);
}

export function getModuleStatus(trainingModule: { progressPercent: number }): ModuleStatus {
  if (trainingModule.progressPercent >= 100) return "completed";
  if (trainingModule.progressPercent <= 0) return "not_started";
  return "in_progress";
}

// An exam unlocks once every chapter in its module is completed, and stays
// "passed" once a passing attempt exists. Once unlocked, an attempt that
// didn't reach the pass mark (a `bestScore` with no passing attempt) shows as
// "failed" rather than reverting to "ready", so the trainee sees their result
// instead of a blank slate.
export function getExamStatus(trainingModule: TrainingModule, exam: ModuleExam): ExamStatus {
  if (exam.passed) return "passed";
  const { completed, total } = getChapterProgress(trainingModule);
  if (total === 0 || completed < total) return "locked";
  return exam.bestScore !== null ? "failed" : "ready";
}

// Picks one of a module's exams by slug (the `?exam=` query param on the exam
// pages), falling back to the first exam when the slug is missing or unknown.
// Null only when the module has no exams at all.
export function findExam(trainingModule: TrainingModule, examSlug: string | null | undefined): ModuleExam | null {
  return trainingModule.exams.find((e) => e.slug === examSlug) ?? trainingModule.exams[0] ?? null;
}

// A chapter is locked until every chapter before it (in array order) is
// completed — the first chapter is always at least unlocked. Once unlocked,
// completing any of its materials without finishing the whole chapter moves
// it to "in_progress" rather than leaving it looking untouched.
export function getChapterStatus(trainingModule: TrainingModule, chapterIndex: number): ChapterStatus {
  const chapter = trainingModule.chapters[chapterIndex];
  if (chapter.completedAt !== null) return "completed";

  const previousChapter = trainingModule.chapters[chapterIndex - 1];
  if (previousChapter?.completedAt === null) return "locked";

  const hasProgress = chapter.materials.some((m) => m.completedAt !== null);
  if (hasProgress) return "in_progress";
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
// isn't completed yet. Null once every chapter is done (the exams are what's
// left).
export function getCurrentChapter(trainingModule: TrainingModule) {
  return trainingModule.chapters.find((c) => c.completedAt === null) ?? null;
}

// Picks the module the homepage's "continue learning" card should highlight:
// the first in-progress module (by order), falling back to the first
// not-yet-started one. Null once every module is completed, or there are
// none at all.
export function pickContinueModule(modules: TrainingModuleSummary[]): TrainingModuleSummary | null {
  const inProgress = modules.find((m) => getModuleStatus(m) === "in_progress");
  if (inProgress) return inProgress;
  return modules.find((m) => getModuleStatus(m) === "not_started") ?? null;
}
