// Static placeholder data for the module exams list. Stands in for the
// future LMS exam/assessment API — no network calls here yet.

export type ExamStatus = "passed" | "ready" | "locked";

export type ModuleExam = {
  id: string;
  title: string;
  moduleLabel: string;
  scenario: string;
  passMark: number;
  status: ExamStatus;
  score?: number;
  dueDate: string;
};

export const moduleExams: ModuleExam[] = [
  {
    id: "molecule-detailing-final",
    title: "মলিকিউল ডিটেইলিং চূড়ান্ত মূল্যায়ন পরীক্ষা",
    moduleLabel: "সেলস ট্রেনিং মডিউল: মেডিকেল ডিটেইলিং ও মলিকিউল জ্ঞান (Medical Detailing & Molecule Mastery)",
    scenario:
      'একজন সিনিয়র কনসালট্যান্ট ফিজিশিয়ান প্রশ্ন করলেন: "আমি তো দীর্ঘদিনের প্রতিষ্ঠিত ব্র্যান্ড লিখছি, আপনাদের এমপ্লিফায়েড MUPS ফর্মুলেশনে এমন কী বিশেষ সুবিধা আছে যার জন্য আ...',
    passMark: 80,
    status: "passed",
    score: 95,
    dueDate: "Passed",
  },
  {
    id: "chamber-detailing-final",
    title: "চেম্বার ডিটেইলিং চূড়ান্ত পরীক্ষা",
    moduleLabel: "সেলস ট্রেনিং মডিউল: ডাক্তার চেম্বার কমিউনিকেশন ও এটিকেট (Doctor Chamber Detailing)",
    scenario:
      'আপনি একজন ব্যস্ত কার্ডিওলজিস্টের চেম্বারে আছেন। ডাক্তার বলছেন: "আমার হাতে মাত্র ৩০ সেকেন্ড সময় আছে, তাড়াতাড়ি বলুন।" এই ৩০ সেকেন্ডে আপনার প্রোডাক্টের সবচেয়ে...',
    passMark: 80,
    status: "locked",
    dueDate: "Oct 30",
  },
  {
    id: "chemist-sales-assessment",
    title: "কেমিস্ট সেলস ও স্টক অ্যাসেসমেন্ট",
    moduleLabel: "সেলস ট্রেনিং মডিউল: ফার্মেসি ও কেমিস্ট ম্যানেজমেন্ট (Pharmacy & Retail Chemist Sales)",
    scenario:
      'হাসপাতালের সামনের প্রধান কেমিস্ট বলছেন: "প্রেসক্রিপশন আসলে তবেই স্টক রাখব, আগে থেকে অর্ডার রাখতে পারব না।" পাশের ৩ জন কনসালট্যান্টের প্রেসক্রিপশন নিশ্চয়তা দিয়ে তাকে...',
    passMark: 85,
    status: "ready",
    dueDate: "Nov 15",
  },
  {
    id: "competitor-objection-final",
    title: "প্রতিযোগী আপত্তি হ্যান্ডলিং চূড়ান্ত পরীক্ষা",
    moduleLabel: "সেলস ট্রেনিং মডিউল: প্রতিযোগী ব্র্যান্ড আপত্তি হ্যান্ডলিং (Overcoming Competitor Brand Loyalty)",
    scenario:
      'একজন প্রফেসর বললেন: "আমি অমুক কোম্পানির ওষুধ দিয়েই শতভাগ সন্তুষ্ট, কোনো সমস্যা তো পাচ্ছি না।" ডাক্তারের সন্তুষ্টিকে সম্মান দিয়ে কীভাবে আপনার নতুন ফর্মুলেশনের ট্রায়াল প্রেসক্রিপশ...',
    passMark: 80,
    status: "ready",
    dueDate: "Nov 05",
  },
  {
    id: "compliance-final",
    title: "কমপ্লায়েন্স চূড়ান্ত পরীক্ষা",
    moduleLabel: "সেলস ট্রেনিং মডিউল: ফার্মা এথিক্স ও রেগুলেটরি কমপ্লায়েন্স (Pharma Ethics & DGDA Guidelines)",
    scenario:
      'একজন ডাক্তার বললেন: "অফ-লেবেল ইউজের জন্য একটু বাড়িয়ে বললে ক্ষতি কী?" নৈতিক প্রচার নীতি বজায় রেখে কীভাবে সঠিক ইনডিকেশন উপস্থাপন করবেন তা দেখান...',
    passMark: 80,
    status: "passed",
    score: 92,
    dueDate: "Passed",
  },
];
