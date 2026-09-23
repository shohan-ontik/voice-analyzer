import { redirect } from "next/navigation";
import { ExamCard } from "../components/exams/ExamCard";
import { ApiClientError, listExams } from "../lib/apiClient";
import { getSessionToken } from "../lib/session";
import type { ExamListItem } from "../lib/types";

export default async function ExamsPage() {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  let exams: ExamListItem[];
  try {
    const { items } = await listExams(token);
    exams = items;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) redirect("/login");
    throw err;
  }

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
        {exams.length === 0 ? (
          <div className="text-center text-[13.5px] text-foreground-muted py-16">কোনো মডিউল খুঁজে পাওয়া যায়নি।</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {exams.map((item) => (
              <ExamCard key={item.exam.id} exam={item.exam} status={item.status} moduleSlug={item.moduleSlug} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
