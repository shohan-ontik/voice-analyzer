// Static placeholder data for the evaluation reports & history list. Stands
// in for the future reporting API — no network calls here yet.

export type ReportKind = "practice" | "exam";

export type EvaluationReport = {
  id: string;
  score: number;
  kind: ReportKind;
  date: string;
  title: string;
  chapter?: string;
  feedback: string;
};

export const evaluationReports: EvaluationReport[] = [
  {
    id: "r1",
    score: 86,
    kind: "practice",
    date: "24/10/2023",
    title: "ডাক্তার চেম্বার কমিউনিকেশন ও এটিকেট",
    chapter: "চ্যাপ্টার: স্পেসিফিক প্রোফাইল ভিত্তিক প্রশ্ন ও ডিটেইলিং",
    feedback:
      "চমৎকার ও পরিপক্ক মেডিকেল ডিটেইলিং। ডাক্তারের অবজেকশন সম্মান জানিয়ে কোনো নেগেটিভ সেলিং ছাড়াই নির্দিষ্ট বিফ্লাস্টাফি রোগীর জন্য ট্রায়াল চেয়ে চমৎকার...",
  },
  {
    id: "r2",
    score: 90,
    kind: "practice",
    date: "24/10/2023",
    title: "প্রতিযোগী ব্র্যান্ড আপত্তি হ্যান্ডলিং",
    chapter: "চ্যাপ্টার: ব্র্যান্ড আনুগত্যের মূল কারণ বোঝা",
    feedback:
      "অত্যন্ত ইতিবাচক উপস্থাপন। ডাক্তারকে প্রতিরক্ষায় অবস্থান না দাঁড় করিয়ে সরাসরি ডায়াবেটিক ডিসলিপিডেমিয়া পেশেন্ট প্রোফাইল টার্গেট করে কার্যকর প্রেসক্রিপশন...",
  },
  {
    id: "r3",
    score: 95,
    kind: "exam",
    date: "20/10/2023",
    title: "মেডিকেল ডিটেইলিং ও মলিকিউল জ্ঞান",
    feedback:
      "অনবদ্য মেডিকেল পিচ। পেডিয়াট্রিক রোগীদের জন্য টেইস্ট, সাসপেনশন স্টাবিলিটি এবং ব্যাকটেরিয়াল ইরাডিকেশন রেট সুনির্দিষ্টভাবে তুলে ধরা ৬০ সেকেন্ডের সময়সীমার...",
  },
];
