// Static placeholder data for the redesigned dashboard home. Stands in for
// the future LMS-style progress/training API — no network calls here yet.

export type UpcomingExam = {
  dueDate: string;
  title: string;
  description: string;
  prerequisiteLabel: string;
  prerequisiteStatus: string;
};

export const upcomingExam: UpcomingExam = {
  dueDate: "২৫/১০/২০২৬",
  title: "এথিক্স ও কম্প্লায়েন্স ২০২৬",
  description:
    "ক্লায়েন্ট গোপনীয়তা, দুর্নীতিবিরোধী নীতি এবং মানদণ্ড যাচাই সংক্রান্ত বার্ষিক মূল্যায়ন।",
  prerequisiteLabel: "প্রয়োজনীয় পূর্বশর্ত",
  prerequisiteStatus: "সম্পন্ন হয়েছে",
};
