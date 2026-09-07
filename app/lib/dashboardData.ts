// Static placeholder data for the redesigned dashboard home. Stands in for
// the future LMS-style progress/training API — no network calls here yet.

export type DashboardUser = {
  firstName: string;
  fullName: string;
  employeeId: string;
  role: string;
  roleWithCode: string;
  team: string;
};

export const dashboardUser: DashboardUser = {
  firstName: "নুরুল",
  fullName: "নুরুল ইসলাম (Nurul Islam)",
  employeeId: "EMP-1048",
  role: "সেলস অফিসার",
  roleWithCode: "সেলস অফিসার (SO)",
  team: "Enterprise Sales",
};

export type DashboardStat = {
  key: string;
  label: string;
  value: string;
  suffix?: string;
  icon: "book" | "zap" | "award" | "chart";
  tone: "teal" | "navy" | "success" | "accent";
};

export const dashboardStats: DashboardStat[] = [
  { key: "chapters", label: "কমপ্লিট চ্যাপ্টার", value: "12", icon: "book", tone: "teal" },
  { key: "practice", label: "প্র্যাকটিস পিচ", value: "45", icon: "zap", tone: "navy" },
  { key: "exams", label: "পাস করা এক্সাম", value: "4", icon: "award", tone: "success" },
  { key: "score", label: "আভারেজ স্কোর", value: "88", suffix: "%", icon: "chart", tone: "accent" },
];

export type ContinueLearningModule = {
  statusBadge: string;
  moduleLabel: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  progressLabel: string;
  progressPercent: number;
  currentChapter: {
    number: number;
    title: string;
    meta: string;
  };
};

export const continueLearningModule: ContinueLearningModule = {
  statusBadge: "চলমান (IN PROGRESS)",
  moduleLabel: "মডিউল ২",
  title: "ডাক্তার চেম্বার কমিউনিকেশন ও এটিকেট (Doctor Chamber Detailing)",
  description:
    "ব্যস্ত ডাক্তার চেম্বারে সীমিত সময়ে দক্ষতার সাথে যোগাযোগ, প্রোডাক্ট ডিটেইলিং, রোগীর প্রোফাইল নিয়ে প্রশ্ন এবং প্রেসক্রিপশন প্রতিশ্রুতি অর্জন।",
  thumbnailUrl: "https://picsum.photos/seed/doctor-chamber-detailing/160/160",
  progressLabel: "অগ্রগতি (অধ্যায় ২ / ৩)",
  progressPercent: 45,
  currentChapter: {
    number: 2,
    title: "প্রশ্নকরণ কৌশল (Questioning Techniques)",
    meta: "১টি ভিডিও  •  ১টি পিডিএফ গাইড  •  ১টি অডিও",
  },
};

export type UpcomingExam = {
  urgencyBadge: string;
  dueDate: string;
  title: string;
  description: string;
  prerequisiteLabel: string;
  prerequisiteStatus: string;
};

export const upcomingExam: UpcomingExam = {
  urgencyBadge: "জরুরি মূল্যায়ন",
  dueDate: "২৫/১০/২০২৬",
  title: "এথিক্স ও কম্প্লায়েন্স ২০২৬",
  description:
    "ক্লায়েন্ট গোপনীয়তা, দুর্নীতিবিরোধী নীতি এবং মানদণ্ড যাচাই সংক্রান্ত বার্ষিক মূল্যায়ন।",
  prerequisiteLabel: "প্রয়োজনীয় পূর্বশর্ত",
  prerequisiteStatus: "সম্পন্ন হয়েছে",
};
