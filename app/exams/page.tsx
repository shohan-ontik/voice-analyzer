"use client";

import { ExamCard } from "../components/ExamCard";
import { getExamStatus } from "../lib/moduleProgress";
import { useModules } from "../lib/useModules";

export default function ExamsPage() {
  const { modules, error } = useModules();

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-4 pt-6 pb-6 lg:px-10 lg:pt-10">
        <h1 className="font-display font-bold text-[22px] lg:text-[28px] text-foreground mb-1.5">
          মডিউল এক্সামসমূহ
        </h1>
        <p className="text-[13.5px] lg:text-[14.5px] text-foreground-muted max-w-[560px]">
          বাস্তবসম্মত ক্লায়েন্ট সিচুয়েশনে আপনার স্কিল প্রমাণ করুন। পাস মার্ক ৮০%।
        </p>
      </div>

      <div className="px-4 pb-10 lg:px-10 lg:pb-12">
        {error ? (
          <div className="text-center text-[13.5px] text-red-600 py-16">{error}</div>
        ) : !modules ? (
          <div className="text-center text-[13.5px] text-foreground-muted py-16">লোড হচ্ছে…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {modules.map((m) => (
              <ExamCard key={m.exam.id} exam={m.exam} status={getExamStatus(m)} moduleSlug={m.slug} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
