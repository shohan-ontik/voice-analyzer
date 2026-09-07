// Static placeholder data for the module exams list. Stands in for the
// future LMS exam/assessment API — no network calls here yet.

export type ExamStatus = "passed" | "ready" | "locked";

export type ExamReportSkillIcon = "brain" | "package" | "shield" | "mic" | "clock";

export type ExamReportSkill = {
  icon: ExamReportSkillIcon;
  label: string;
  percent: number;
  note: string;
};

export type ExamReport = {
  moduleName: string;
  verdictHeadline: string;
  feedback: string;
  skills: ExamReportSkill[];
  transcript: string;
};

export type ModuleExam = {
  id: string;
  title: string;
  moduleLabel: string;
  scenario: string;
  passMark: number;
  status: ExamStatus;
  score?: number;
  dueDate: string;
  // Populated once an exam has been taken and passed.
  report?: ExamReport;
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
    report: {
      moduleName: "মেডিকেল ডিটেইলিং ও মলিকিউল জ্ঞান",
      verdictHeadline: "চমৎকার উপস্থাপন ও দৃঢ় যুক্তি",
      feedback:
        "অনবদ্য মেডিকেল পিচ। পেডিয়াট্রিক রোগীদের জন্য টেস্ট, সাসপেনশন স্টাবিলিটি এবং ব্যাকটেরিয়াল ইরাডিকেশন রেট সুনির্দিষ্টভাবে তুলে ধরা ৬০ সেকেন্ডের সময়সীমার শতভাগ সদ্ব্যবহার করা হয়েছে।",
      skills: [
        {
          icon: "brain",
          label: "বিক্রয় উপস্থাপনা ও আত্মবিশ্বাস",
          percent: 96,
          note: "চমৎকার আত্মবিশ্বাস ও ফোকাসড টাইম-অ্যাওয়ারনেস বজায় রাখা হয়েছে।",
        },
        {
          icon: "package",
          label: "তথ্যের সঠিকতা ও প্রাসঙ্গিকতা",
          percent: 95,
          note: "দ্রুত, তথ্যসমৃদ্ধ, নির্ভুল এবং পেডিয়াট্রিক প্রেক্ষাপটে যথাযথ।",
        },
        {
          icon: "shield",
          label: "সিনারিও সমন্বয় ও আপত্তি হ্যান্ডলিং",
          percent: 94,
          note: "পেডিয়াট্রিক কমপ্লায়েন্সের শক্ত যুক্তি তৈরি করেছেন।",
        },
        {
          icon: "mic",
          label: "বাচনভঙ্গি স্পষ্টতা ও সহজবোধ্যতা",
          percent: 96,
          note: "উচ্চারণ স্পষ্ট এবং জটিল শব্দও সহজবোধ্য উপায়ে ব্যাখ্যা করা হয়েছে।",
        },
        {
          icon: "clock",
          label: "সময় ব্যবস্থাপনা ও ক্লোজিং",
          percent: 95,
          note: "৬০ সেকেন্ডের মধ্যে কার্যকরভাবে পিচ শেষ করে স্পষ্ট ক্লোজিং করা হয়েছে।",
        },
      ],
      transcript:
        "আসসালামু আলাইকুম স্যার। আমাদের সেফিক্সিম ট্রাইহাইড্রেট ড্রাই সিরাপ পেডিয়াট্রিক রোগীদের ক্ষেত্রে গ্যাস্ট্রিক ইরিটেশন ছাড়াই ৯৮% ব্যাকটেরিয়াল ইরাডিকেশন রেট নিশ্চিত করে। এর উন্নত সাসপেনশন স্ট্যাবিলিটি ও চমৎকার ফ্লেভারের কারণে শিশুদের ড্রাগ কমপ্লায়েন্স নিশ্চিত হয়। স্যার, আপনার চেম্বারে রেসপিরেটরি ট্র্যাক্ট ইনফেকশনে আক্রান্ত শিশুদের জন্য কি আমাদের ব্র্যান্ডটি প্রথম পছন্দ হিসেবে রাখার সুযোগ পাব?",
    },
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
    report: {
      moduleName: "ফার্মা এথিক্স ও রেগুলেটরি কমপ্লায়েন্স",
      verdictHeadline: "নৈতিক অবস্থানে দৃঢ় ও পেশাদার",
      feedback:
        "অফ-লেবেল ব্যবহারের অনুরোধ দৃঢ়ভাবে প্রত্যাখ্যান করে শুধুমাত্র DGDA অনুমোদিত ইনডিকেশনের মধ্যে থেকে ওষুধের সুবিধা কার্যকরভাবে উপস্থাপন করা হয়েছে।",
      skills: [
        {
          icon: "brain",
          label: "বিক্রয় উপস্থাপনা ও আত্মবিশ্বাস",
          percent: 90,
          note: "শান্ত ও আত্মবিশ্বাসী সুরে নৈতিক অবস্থান তুলে ধরা হয়েছে।",
        },
        {
          icon: "package",
          label: "তথ্যের সঠিকতা ও প্রাসঙ্গিকতা",
          percent: 94,
          note: "শুধুমাত্র DGDA অনুমোদিত তথ্য ব্যবহার করা হয়েছে।",
        },
        {
          icon: "shield",
          label: "সিনারিও সমন্বয় ও আপত্তি হ্যান্ডলিং",
          percent: 93,
          note: "নৈতিক চাপ সামলে পেশাদার সমাধান দেওয়া হয়েছে।",
        },
        {
          icon: "mic",
          label: "বাচনভঙ্গি স্পষ্টতা ও সহজবোধ্যতা",
          percent: 91,
          note: "বার্তা স্পষ্ট ও দ্ব্যর্থহীনভাবে পৌঁছানো হয়েছে।",
        },
        {
          icon: "clock",
          label: "সময় ব্যবস্থাপনা ও ক্লোজিং",
          percent: 92,
          note: "সময়মতো কথোপকথন পেশাদারভাবে শেষ করা হয়েছে।",
        },
      ],
      transcript:
        "স্যার, বুঝতে পারছি আপনি রোগীর দ্রুত উপকারের কথা ভাবছেন। তবে আমাদের কোম্পানির নীতি অনুযায়ী আমি শুধুমাত্র DGDA অনুমোদিত ইনডিকেশনের মধ্যেই ওষুধটির তথ্য দিতে পারি। অনুমোদিত ইনডিকেশনগুলোতেই এই ওষুধ যথেষ্ট কার্যকর ও নিরাপদ প্রমাণিত। আপনি চাইলে আমি অনুমোদিত ক্লিনিক্যাল ডেটা শেয়ার করতে পারি, যা আপনার সিদ্ধান্ত নিতে সাহায্য করবে।",
    },
  },
];
