import type { PitchScenario } from "./types";

// The roleplay briefing page generates a scenario via AI and the record page
// needs to show that exact same scenario (not a freshly generated one) while
// the rep is on the call, so it's cached in sessionStorage between the two.
export function scenarioCacheKey(moduleSlug: string, chapterSlug: string) {
  return `roleplay-scenario:${moduleSlug}:${chapterSlug}`;
}

export function readCachedScenario(key: string): PitchScenario | null {
  if (typeof window === "undefined") return null;
  const cached = sessionStorage.getItem(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as PitchScenario;
  } catch {
    return null;
  }
}

export function writeCachedScenario(key: string, scenario: PitchScenario) {
  sessionStorage.setItem(key, JSON.stringify(scenario));
}
