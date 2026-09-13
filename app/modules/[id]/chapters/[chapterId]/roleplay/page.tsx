"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ScenarioBriefing } from "../../../../../components/ScenarioBriefing";
import { ArrowLeftIcon } from "../../../../../components/icons";
import { chapterHeadline } from "../../../../../lib/chapterHeadline";
import { authFetch } from "../../../../../lib/clientFetch";
import { readCachedScenario, scenarioCacheKey, writeCachedScenario } from "../../../../../lib/roleplayScenarioCache";
import type { PitchScenario } from "../../../../../lib/types";
import { useModule } from "../../../../../lib/useModules";

export default function ChapterRoleplayPage() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const { trainingModule, error, loading } = useModule(id);

  const chapter = trainingModule?.chapters.find((c) => c.slug === chapterId);
  const scenarioKey = scenarioCacheKey(id, chapterId);

  const [scenario, setScenario] = useState<PitchScenario | null>(() => readCachedScenario(scenarioKey));
  const [scenarioLoading, setScenarioLoading] = useState(() => readCachedScenario(scenarioKey) === null);
  const [scenarioError, setScenarioError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const generateScenario = useCallback(async (): Promise<PitchScenario> => {
    const res = await authFetch(
      `/api/modules/${encodeURIComponent(id)}/chapters/${encodeURIComponent(chapterId)}/scenario`,
      { method: "POST" }
    );
    const body = await res.json();
    if (!res.ok) throw new Error(body?.error?.message ?? "AI সিনারিও তৈরি করা যায়নি।");
    return body as PitchScenario;
  }, [id, chapterId]);

  useEffect(() => {
    if (!chapter || scenario) return;
    let cancelled = false;
    generateScenario()
      .then((result) => {
        if (cancelled) return;
        setScenario(result);
        writeCachedScenario(scenarioKey, result);
      })
      .catch((err) => {
        if (!cancelled) setScenarioError(err instanceof Error ? err.message : "AI সিনারিও তৈরি করা যায়নি।");
      })
      .finally(() => {
        if (!cancelled) setScenarioLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [chapter, scenario, scenarioKey, generateScenario]);

  const regenerate = useCallback(() => {
    setRegenerating(true);
    setScenarioError(null);
    generateScenario()
      .then((result) => {
        setScenario(result);
        writeCachedScenario(scenarioKey, result);
      })
      .catch((err) => setScenarioError(err instanceof Error ? err.message : "AI সিনারিও তৈরি করা যায়নি।"))
      .finally(() => setRegenerating(false));
  }, [scenarioKey, generateScenario]);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-[13.5px] text-foreground-muted">লোড হচ্ছে…</div>;
  }

  if (error || !trainingModule) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">{error ?? "মডিউল খুঁজে পাওয়া যায়নি।"}</p>
        <Link href="/modules" className="text-[13px] font-semibold text-navy cursor-pointer">
          সকল মডিউল ফিরে যান
        </Link>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">অধ্যায় খুঁজে পাওয়া যায়নি।</p>
        <Link href={`/modules/${trainingModule.slug}`} className="text-[13px] font-semibold text-navy cursor-pointer">
          মডিউলে ফিরে যান
        </Link>
      </div>
    );
  }

  const headline = chapterHeadline(chapter.title);
  const activeScenario = scenario ?? chapter.scenario;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 pt-6 lg:px-10 lg:pt-8 flex items-center gap-2 text-[13px] flex-wrap">
        <Link
          href={`/modules/${trainingModule.slug}/chapters/${chapter.slug}`}
          className="flex items-center gap-1 font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
        >
          <ArrowLeftIcon size={14} />
          অধ্যায়ে ফিরুন
        </Link>
      </div>

      <div className="px-4 pt-4 pb-8 lg:px-10 lg:pb-12 max-w-[820px]">
        {scenarioLoading && !scenario ? (
          <div className="rounded-2xl border border-border bg-background-elevated p-8 flex flex-col items-center gap-3 text-center">
            <div className="w-9 h-9 rounded-full border-[3px] border-navy/20 border-t-navy animate-spin" />
            <p className="text-[13.5px] text-foreground-muted">AI দিয়ে এই চ্যাপ্টারের জন্য সিনারিও তৈরি হচ্ছে…</p>
          </div>
        ) : (
          <>
            <ScenarioBriefing
              topicTitle={headline}
              scenario={activeScenario}
              recordHref={`/modules/${trainingModule.slug}/chapters/${chapter.slug}/roleplay/record`}
              onRegenerate={regenerate}
              regenerating={regenerating}
            />
            {scenarioError && (
              <p className="text-[12px] text-warning-ink bg-warning-soft rounded-lg px-3 py-2 mt-3">{scenarioError}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
