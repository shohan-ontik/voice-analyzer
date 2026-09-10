"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ScenarioBriefing } from "../../../../../components/ScenarioBriefing";
import { ArrowLeftIcon } from "../../../../../components/icons";
import { chapterHeadline } from "../../../../../lib/chapterHeadline";
import { useModule } from "../../../../../lib/useModules";

export default function ChapterRoleplayPage() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const { trainingModule, error, loading } = useModule(id);

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

  const chapter = trainingModule.chapters.find((c) => c.slug === chapterId);

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
        <ScenarioBriefing
          topicTitle={headline}
          scenario={chapter.scenario}
          recordHref={`/modules/${trainingModule.slug}/chapters/${chapter.slug}/roleplay/record`}
        />
      </div>
    </div>
  );
}
