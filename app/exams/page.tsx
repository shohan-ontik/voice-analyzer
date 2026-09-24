import { redirect } from "next/navigation";
import { ExamsList } from "../components/exams/ExamsList";
import { ApiClientError, listExams } from "../lib/apiClient";
import { getSessionToken } from "../lib/session";
import type { ExamListItem } from "../lib/types";

export const EXAMS_PAGE_SIZE = 10;

export default async function ExamsPage() {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  let exams: ExamListItem[];
  let total: number;
  try {
    const result = await listExams(token, { page: 1, pageSize: EXAMS_PAGE_SIZE });
    exams = result.items;
    total = result.total;
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

      <ExamsList initialExams={exams} initialTotal={total} pageSize={EXAMS_PAGE_SIZE} />
    </div>
  );
}
