// Static placeholder data for the training modules list. Stands in for the
// future LMS module/progress API — no network calls here yet.

export type ModuleStatus = "completed" | "in_progress" | "not_started";

export type TrainingModule = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  status: ModuleStatus;
  completedChapters: number;
  totalChapters: number;
  hasExam: boolean;
};

export const trainingModules: TrainingModule[] = [
  {
    id: "medical-detailing",
    title: "মেডিকেল ডিটেইলিং ও মলিকিউল জ্ঞান (Medical Detailing & Molecule Knowledge)",
    description:
      "মলিকিউলের কার্যকারিতা, বায়ো-ইকুইভ্যালেন্স, ড্রাগ ডেলিভারি টেকনোলজি (MUPS) এবং ডক্টর চেম্বারে বিজ্ঞানসম্মত ডিটেইলিংয়ের মূল কলাকৌশল।",
    thumbnailUrl: "https://picsum.photos/seed/medical-detailing/400/240",
    status: "completed",
    completedChapters: 2,
    totalChapters: 2,
    hasExam: true,
  },
  {
    id: "doctor-chamber",
    title: "ডাক্তার চেম্বার কমিউনিকেশন ও এটিকেট (Doctor Chamber Communication & Etiquette)",
    description:
      "ব্যস্ত ডাক্তার চেম্বারে সীমিত সময়ে দক্ষতার সাথে যোগাযোগ, প্রোডাক্ট ডিটেইলিং, রোগীর প্রোফাইল নিয়ে প্রশ্ন এবং প্রেসক্রিপশন প্রতিশ্রুতি অর্জন।",
    thumbnailUrl: "https://picsum.photos/seed/doctor-chamber-detailing/400/240",
    status: "in_progress",
    completedChapters: 1,
    totalChapters: 3,
    hasExam: true,
  },
  {
    id: "pharmacy-chemist",
    title: "ফার্মেসি ও কেমিস্ট ম্যানেজমেন্ট (Pharmacy & Chemist Management)",
    description:
      "প্রেসক্রিপশন ওষুধের পর্যাপ্ত মজুদ নিশ্চিতকরণ, কাউন্টার সাবস্টিটিউশন প্রতিরোধ, এবং কেমিস্টদের সাথে বাণিজ্যিক সম্পর্ক উন্নয়ন।",
    thumbnailUrl: "https://picsum.photos/seed/pharmacy-chemist/400/240",
    status: "not_started",
    completedChapters: 0,
    totalChapters: 2,
    hasExam: true,
  },
  {
    id: "competitor-objection",
    title: "প্রতিযোগী ব্র্যান্ড আপত্তি হ্যান্ডলিং (Overcoming Competitor Brand Objections)",
    description:
      "ডাক্তারদের ৫-১০ বছরের প্রতিষ্ঠিত ব্র্যান্ডের প্রতি আনুগত্য ভাঙিয়ে নতুন ক্লিনিক্যাল প্রমাণ দিয়ে ব্র্যান্ড সুইচ করানো।",
    thumbnailUrl: "https://picsum.photos/seed/competitor-objection/400/240",
    status: "in_progress",
    completedChapters: 1,
    totalChapters: 2,
    hasExam: true,
  },
  {
    id: "pharma-ethics",
    title: "ফার্মা এথিক্স ও রেগুলেটরি কমপ্লায়েন্স (Pharma Ethics & Regulatory Compliance)",
    description:
      "বাংলাদেশ ঔষধ প্রশাসন (DGDA) নির্দেশিকা, নৈতিক প্রচার নীতি এবং ওষুধের সঠিক ইনডিকেশন উপস্থাপনের নিয়মাবলি।",
    thumbnailUrl: "https://picsum.photos/seed/pharma-ethics/400/240",
    status: "completed",
    completedChapters: 1,
    totalChapters: 1,
    hasExam: true,
  },
  {
    id: "kol-engagement",
    title: "কী ওপিনিয়ন লিডার (KOL) এনগেজমেন্ট কৌশল (KOL Engagement Strategy)",
    description:
      "প্রভাবশালী চিকিৎসকদের সাথে দীর্ঘমেয়াদী সম্পর্ক গড়ে তোলা এবং মেডিকেল কনফারেন্সে ব্র্যান্ড উপস্থাপনার কৌশল।",
    thumbnailUrl: "https://picsum.photos/seed/kol-engagement/400/240",
    status: "not_started",
    completedChapters: 0,
    totalChapters: 3,
    hasExam: false,
  },
];
