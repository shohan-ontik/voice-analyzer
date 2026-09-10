"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MaterialsSection } from "../../../../components/MaterialsSection";
import { RoleplayCtaBanner } from "../../../../components/RoleplayCtaBanner";
import { ArrowLeftIcon, BookIcon, SparkleIcon } from "../../../../components/icons";
import { authFetch } from "../../../../lib/clientFetch";
import { useModule } from "../../../../lib/useModules";

// Chapter titles are stored as "চ্যাপ্টার ১: ..." — this strips that prefix
// for the chapter detail hero, which shows the chapter number as its own
// badge instead.
function chapterHeadline(title: string) {
  return title.replace(/^চ্যাপ্টার\s*[০-৯0-9]+\s*[:ঃ]\s*/, "");
}

export default function ChapterDetailPage() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const { trainingModule, error, loading, refetch } = useModule(id);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-[13.5px] text-foreground-muted">লোড হচ্ছে…</div>;
  }

  if (error || !trainingModule) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">{error ?? "মডিউল খুঁজে পাওয়া যায়নি।"}</p>
        <Link href="/modules" className="text-[13px] font-semibold text-navy">
          সকল মডিউল ফিরে যান
        </Link>
      </div>
    );
  }

  const chapterIndex = trainingModule.chapters.findIndex((c) => c.slug === chapterId);
  const chapter = trainingModule.chapters[chapterIndex];

  if (!chapter) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">অধ্যায় খুঁজে পাওয়া যায়নি।</p>
        <Link href={`/modules/${trainingModule.slug}`} className="text-[13px] font-semibold text-navy">
          মডিউলে ফিরে যান
        </Link>
      </div>
    );
  }

  const chapterNumber = chapterIndex + 1;
  const headline = chapterHeadline(chapter.title);

  async function handleMarkComplete(materialId: string) {
    const res = await authFetch(
      `/api/modules/${trainingModule!.slug}/chapters/${chapter!.slug}/materials/${materialId}/complete`,
      { method: "POST" }
    );
    if (res.ok) refetch();
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 pt-6 lg:px-10 lg:pt-8 flex items-center gap-2 text-[13px] flex-wrap">
        <Link
          href="/modules"
          className="flex items-center gap-1 font-semibold text-foreground-muted hover:text-foreground"
        >
          <ArrowLeftIcon size={14} />
          মডিউল
        </Link>
        <span className="text-foreground-muted">/</span>
        <Link
          href={`/modules/${trainingModule.slug}`}
          className="font-semibold text-foreground-muted hover:text-foreground truncate max-w-[260px]"
        >
          {trainingModule.title}
        </Link>
        <span className="text-foreground-muted">/</span>
        <span className="font-bold text-foreground">চ্যাপ্টার {chapterNumber}</span>
      </div>

      <div className="px-4 pt-4 pb-6 lg:px-10 lg:pb-8">
        <div className="rounded-2xl border border-border bg-background-elevated p-5 lg:p-8">
          <div className="flex items-center gap-2 flex-wrap mb-3 text-[12.5px]">
            <span className="px-2.5 py-1 rounded-full bg-navy-soft text-navy font-bold border border-navy/15">
              চ্যাপ্টার {chapterNumber}
            </span>
            <span className="text-foreground-muted">•</span>
            <span className="text-foreground-muted font-semibold uppercase">{trainingModule.title}</span>
          </div>

          <h1 className="font-display font-bold text-[24px] lg:text-[30px] text-foreground mb-3 leading-tight">
            {headline}
          </h1>

          <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted leading-relaxed max-w-[820px]">
            {chapter.description}
          </p>

          <div className="h-px bg-border my-5" />

          <div className="flex items-center gap-4 flex-wrap text-[12.5px]">
            <span className="flex items-center gap-1.5 text-foreground-muted">
              <BookIcon size={14} />
              {chapter.materials.length}টি শিখন উপাদান
            </span>
            <span className="flex items-center gap-1.5 text-navy font-semibold">
              <SparkleIcon size={13} />
              AI অনুশীলনের জন্য প্রস্তুত
            </span>
            <span className="px-2.5 py-1 rounded-full bg-success-soft text-success text-[11px] font-bold">
              রিয়েল ডিভাইস মিডিয়া সাপোর্টেড
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 lg:px-10">
        <h2 className="font-display font-bold text-[17px] text-foreground mb-1">অধ্যায়ের শিক্ষণীয় উপাদানসমূহ</h2>
        <p className="text-[12.5px] text-foreground-muted mb-4">অনুশীলনের আগে সব উপাদান মনোযোগ দিয়ে দেখুন</p>

        <MaterialsSection
          materials={chapter.materials}
          chapterHeadline={headline}
          scenario={chapter.scenario}
          onMarkComplete={handleMarkComplete}
        />
      </div>

      <div className="px-4 pb-10 lg:px-10 lg:pb-12">
        <RoleplayCtaBanner topicTitle={headline} scenario={chapter.scenario} />
      </div>
    </div>
  );
}
