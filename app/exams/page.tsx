import { ExamCard } from "../components/ExamCard";
import { moduleExams } from "../lib/examsData";

export default function ExamsPage() {
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

      <div className="px-4 pb-10 lg:px-10 lg:pb-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {moduleExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}
