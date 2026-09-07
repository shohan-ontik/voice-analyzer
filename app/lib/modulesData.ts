// Static placeholder data for the training modules list. Stands in for the
// future LMS module/progress API — no network calls here yet.

export type ModuleStatus = "completed" | "in_progress" | "not_started";

export type ChapterStatus = "completed" | "in_progress" | "not_started";

export type LearningMaterialType = "video" | "pdf" | "audio";

export type LearningMaterial = {
  id: string;
  type: LearningMaterialType;
  title: string;
  // e.g. "10 mins" for video/audio, "6 pages" for a pdf.
  meta: string;
  filename: string;
};

export type PitchScenario = {
  clientInitials: string;
  clientName: string;
  clientTitle: string;
  objection: string;
  objective: string;
  criteria: string[];
};

export type ModuleChapter = {
  id: string;
  title: string;
  description: string;
  status: ChapterStatus;
  videoCount: number;
  guideCount: number;
  audioCount: number;
  materials: LearningMaterial[];
  scenario: PitchScenario;
};

export type TrainingModule = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  status: ModuleStatus;
  completedChapters: number;
  totalChapters: number;
  hasExam: boolean;
  // Matches an id in examsData.moduleExams when hasExam is true.
  examId?: string;
  chapters: ModuleChapter[];
};

// Chapter titles are stored as "চ্যাপ্টার ১: ..." for the list view — this
// strips that prefix for contexts (like the chapter detail hero) that show
// the chapter number as its own badge instead.
export function chapterHeadline(title: string) {
  return title.replace(/^চ্যাপ্টার\s*[০-৯0-9]+\s*[:ঃ]\s*/, "");
}

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
    examId: "molecule-detailing-final",
    chapters: [
      {
        id: "mups-technology",
        title: "চ্যাপ্টার ১: মলিকিউল সায়েন্স ও ড্রাগ ডেলিভারি সিস্টেম (MUPS Technology)",
        description:
          "এসোমেপ্রাজল ও আধুনিক গ্যাস্ট্রোএন্টারোলজি মলিকিউলের মাইক্রো-এনক্যাপসুলেটেড মাল্টি-ইউনিট পেলেটাইজড সিস্টেম (MUPS) এবং ফ্রি অ্যাসিড সাপ্রেশন।",
        status: "completed",
        videoCount: 1,
        guideCount: 1,
        audioCount: 0,
        materials: [
          {
            id: "bioavailability-video",
            type: "video",
            title: "মলিকিউল বায়ো-অ্যাভেইলেবিলিটি ও cGMP স্ট্যান্ডার্ড",
            meta: "10 mins",
            filename: "Molecule_Bioavailability_cGMP.mp4",
          },
          {
            id: "product-monograph",
            type: "pdf",
            title: "প্রোডাক্ট মনোগ্রাফ ও প্রেসক্রাইবিং ইনফরমেশন ২০২৪",
            meta: "6 pages",
            filename: "Product_Monograph_2024.pdf",
          },
        ],
        scenario: {
          clientInitials: "ডা",
          clientName: "ডা. তানভীর আহমেদ",
          clientTitle: "কনসালট্যান্ট গ্যাস্ট্রোএন্টারোলজিস্ট, স্কয়ার হসপিটাল",
          objection:
            "দেখুন ভাই, আমার হাতে খুব বেশি সময় নেই, মাত্র এক মিনিট আছে। আমি তো বছরের পর বছর ধরে বাজারের লিডার ব্র্যান্ডটি ব্যবহার করছি এবং রোগীরাও সন্তুষ্ট। আপনাদের এই নতুন MUPS টেকনোলজির পিপিআই কেন আমি প্রেসক্রাইব করব?",
          objective:
            "প্রখ্যাত গ্যাস্ট্রোএন্টারোলজিস্ট ডা. তানভীর আহমেদ চেম্বারে অত্যন্ত ব্যস্ত আছেন এবং তিনি ইতিমধ্যে একটি পুরনো ও প্রতিষ্ঠিত পিপিআই (PPI) ব্র্যান্ড ব্যবহার করছেন। আপনার লক্ষ্য MUPS টেকনোলজির সুবিধাগুলো মাত্র ৩০-৪৫ সেকেন্ডে সহজ ভাষায় বুঝিয়ে তাঁর কাছ থেকে একটি পজিটিভ রেসপন্স বা ট্রায়াল নিশ্চিত করা।",
          criteria: [
            "কম সময়ে (৩০-৪৫ সেকেন্ডের মধ্যে) MUPS টেকনোলজির মূল সুবিধা যেমন- পেটে যাওয়ার সাথে সাথে সমান্তরালভাবে ড্রাগ রিলিজ হওয়া এবং দ্রুত কার্যকারিতা সুন্দরভাবে উপস্থাপন করা।",
            "পুরনো ব্র্যান্ডের সাথে তুলনা করে কাস্টমারের মনে যে সংশয় রয়েছে, তা রোগীর দ্রুত উপশম ও কম কমপ্লেইনের কথা বলে সফলভাবে হ্যান্ডেল করা।",
            "অতিরিক্ত টেকনিক্যাল বা জটিল রাসায়নিক রাখা এড়িয়ে প্র্যাক্টিক্যাল বেনিফিট ও পেশেন্ট কমপ্লায়েন্সের ওপর জোর দিয়ে একটি প্রফেশনাল ক্লোজিং করা।",
          ],
        },
      },
      {
        id: "competitor-usp",
        title: "চ্যাপ্টার ২: প্রতিযোগী ব্র্যান্ড বনাম আমাদের থেরাপিউটিক ইউএসপি",
        description:
          "মার্কেট লিডার ব্র্যান্ডের তুলনায় উচ্চ বায়ো-ইকুইভ্যালেন্স ও দীর্ঘস্থায়ী অ্যাসিড নিয়ন্ত্রণের ক্লিনিক্যাল ডেটা উপস্থাপন।",
        status: "completed",
        videoCount: 0,
        guideCount: 1,
        audioCount: 0,
        materials: [
          {
            id: "competitor-comparison-sheet",
            type: "pdf",
            title: "প্রতিযোগী ব্র্যান্ড তুলনামূলক ক্লিনিক্যাল ডেটা শিট",
            meta: "4 pages",
            filename: "Competitor_Comparison_Sheet.pdf",
          },
        ],
        scenario: {
          clientInitials: "ডা",
          clientName: "ডা. ফারহানা রহমান",
          clientTitle: "কনসালট্যান্ট মেডিসিন, ইউনাইটেড হাসপাতাল",
          objection: "আপনাদের ব্র্যান্ড তো নতুন, বাজারের পুরনো ব্র্যান্ডটাই তো ভালো কাজ করছে বলে জানি। হঠাৎ পরিবর্তনের কী দরকার?",
          objective:
            "ডা. ফারহানা রহমান মার্কেট লিডার ব্র্যান্ডের প্রতি আস্থাশীল। আপনার লক্ষ্য ক্লিনিক্যাল ডেটা দিয়ে আপনাদের থেরাপিউটিক ইউএসপি স্পষ্টভাবে তুলে ধরে অন্তত একটি ট্রায়াল প্রেসক্রিপশন আদায় করা।",
          criteria: [
            "মার্কেট লিডার ব্র্যান্ডের তুলনায় উচ্চ বায়ো-ইকুইভ্যালেন্সের ডেটা স্পষ্টভাবে ও আত্মবিশ্বাসের সাথে উপস্থাপন করা।",
            "দীর্ঘস্থায়ী অ্যাসিড নিয়ন্ত্রণের ক্লিনিক্যাল সুবিধা রোগীর বাস্তব উপকারের সাথে সংযুক্ত করে বলা।",
            "প্রতিযোগী ব্র্যান্ডকে সরাসরি আক্রমণ না করে পেশাদারভাবে তুলনা উপস্থাপন করা।",
          ],
        },
      },
    ],
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
    examId: "chamber-detailing-final",
    chapters: [
      {
        id: "thirty-second-opening",
        title: "চ্যাপ্টার ১: রোগীর প্রোফাইল ভিত্তিক ৩০-সেকেন্ড ওপেনিং",
        description: "ব্যস্ত ডাক্তারের প্রথম ৩০ সেকেন্ডে সবচেয়ে প্রাসঙ্গিক বার্তা পৌঁছানোর কৌশল।",
        status: "completed",
        videoCount: 1,
        guideCount: 1,
        audioCount: 0,
        materials: [
          {
            id: "opening-demo-video",
            type: "video",
            title: "৩০-সেকেন্ড ওপেনিং স্ক্রিপ্ট ডেমো",
            meta: "8 mins",
            filename: "Thirty_Second_Opening_Demo.mp4",
          },
          {
            id: "patient-profile-checklist",
            type: "pdf",
            title: "রোগীর প্রোফাইল বিশ্লেষণ চেকলিস্ট",
            meta: "3 pages",
            filename: "Patient_Profile_Checklist.pdf",
          },
        ],
        scenario: {
          clientInitials: "ডা",
          clientName: "ডা. ইমরান কবির",
          clientTitle: "জেনারেল ফিজিশিয়ান, ল্যাবএইড হাসপাতাল",
          objection: "ভাই, তাড়াতাড়ি বলুন, রোগী অপেক্ষা করছে। কী বলতে চান?",
          objective:
            "ডা. ইমরান কবিরের কাছে সময় সীমিত। আপনার লক্ষ্য প্রথম ৩০ সেকেন্ডেই সবচেয়ে প্রাসঙ্গিক ও আকর্ষণীয় বার্তাটি পৌঁছে দিয়ে তাঁর মনোযোগ ধরে রাখা।",
          criteria: [
            "প্রথম বাক্যেই সবচেয়ে গুরুত্বপূর্ণ ও প্রাসঙ্গিক তথ্য তুলে ধরা।",
            "অপ্রয়োজনীয় ভূমিকা এড়িয়ে সরাসরি মূল বিষয়ে যাওয়া।",
            "৩০ সেকেন্ডের মধ্যে কথা শেষ করে ডাক্তারের প্রতিক্রিয়ার জন্য জায়গা রাখা।",
          ],
        },
      },
      {
        id: "questioning-techniques",
        title: "চ্যাপ্টার ২: প্রশ্নকরণ কৌশল (Questioning Techniques)",
        description:
          "রোগীর প্রোফাইল নিয়ে সঠিক প্রশ্ন করে ডাক্তারের প্রেসক্রিপশন প্যাটার্ন বোঝা এবং প্রয়োজন অনুযায়ী ডিটেইলিং সাজানো।",
        status: "in_progress",
        videoCount: 1,
        guideCount: 1,
        audioCount: 1,
        materials: [
          {
            id: "questioning-techniques-video",
            type: "video",
            title: "কার্যকর প্রশ্নকরণ কৌশল",
            meta: "12 mins",
            filename: "Questioning_Techniques.mp4",
          },
          {
            id: "spin-selling-framework",
            type: "pdf",
            title: "SPIN সেলিং প্রশ্ন ফ্রেমওয়ার্ক",
            meta: "5 pages",
            filename: "SPIN_Selling_Framework.pdf",
          },
          {
            id: "senior-mr-call-recording",
            type: "audio",
            title: "সিনিয়র এমআরের রিয়েল কল রেকর্ডিং",
            meta: "6 mins",
            filename: "Senior_MR_Call_Recording.mp3",
          },
        ],
        scenario: {
          clientInitials: "ডা",
          clientName: "ডা. নাজমুল হক",
          clientTitle: "কনসালট্যান্ট এন্ডোক্রাইনোলজিস্ট, বারডেম হাসপাতাল",
          objection: "আমার রোগীদের প্রোফাইল সম্পর্কে আপনি কী জানেন যে আমাকে নতুন কিছু সাজেস্ট করছেন?",
          objective:
            "ডা. নাজমুল হকের প্রেসক্রিপশন প্যাটার্ন এখনও অজানা। আপনার লক্ষ্য সঠিক প্রশ্ন করে তাঁর রোগীর প্রোফাইল বুঝে সেই অনুযায়ী ডিটেইলিং সাজানো।",
          criteria: [
            "ওপেন-এন্ডেড প্রশ্নের মাধ্যমে ডাক্তারের রোগীর প্রোফাইল সম্পর্কে তথ্য সংগ্রহ করা।",
            "ডাক্তারের উত্তরের ভিত্তিতে প্রাসঙ্গিকভাবে পরবর্তী প্রশ্ন সাজানো।",
            "প্রশ্নগুলো স্বাভাবিক কথোপকথনের মতো করে জিজ্ঞাসাবাদের মতো না শোনানো।",
          ],
        },
      },
      {
        id: "closing-commitment",
        title: "চ্যাপ্টার ৩: প্রেসক্রিপশন প্রতিশ্রুতি ক্লোজিং কৌশল",
        description: "স্পষ্ট ও নির্দিষ্ট প্রেসক্রিপশন প্রতিশ্রুতি আদায়ে কথোপকথন সমাপ্তির কৌশল।",
        status: "not_started",
        videoCount: 1,
        guideCount: 0,
        audioCount: 0,
        materials: [
          {
            id: "closing-commitment-video",
            type: "video",
            title: "প্রেসক্রিপশন প্রতিশ্রুতি ক্লোজিং টেকনিক",
            meta: "9 mins",
            filename: "Closing_Commitment_Technique.mp4",
          },
        ],
        scenario: {
          clientInitials: "ডা",
          clientName: "ডা. সুমাইয়া ইসলাম",
          clientTitle: "কনসালট্যান্ট গাইনোকোলজিস্ট, স্কয়ার হসপিটাল",
          objection: "ঠিক আছে বুঝলাম, দেখি ভেবে বলব।",
          objective:
            "ডা. সুমাইয়া ইসলাম আগ্রহ দেখিয়েছেন কিন্তু সুনির্দিষ্ট প্রতিশ্রুতি দেননি। আপনার লক্ষ্য কথোপকথন স্পষ্ট ও নির্দিষ্ট প্রেসক্রিপশন প্রতিশ্রুতি দিয়ে শেষ করা।",
          criteria: [
            "\"দেখি\" জাতীয় অস্পষ্ট উত্তরকে সুনির্দিষ্ট প্রতিশ্রুতিতে রূপান্তরের চেষ্টা করা।",
            "নির্দিষ্ট রোগীর ধরন বা সংখ্যা উল্লেখ করে প্রেসক্রিপশন প্রতিশ্রুতি চাওয়া।",
            "কথোপকথন আত্মবিশ্বাসী ও পেশাদার সুরে শেষ করা।",
          ],
        },
      },
    ],
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
    examId: "chemist-sales-assessment",
    chapters: [
      {
        id: "counter-substitution",
        title: "চ্যাপ্টার ১: কাউন্টার সাবস্টিটিউশন প্রতিরোধের কৌশল",
        description: "প্রেসক্রিপশন অনুযায়ী সঠিক ব্র্যান্ড ডিসপেন্স নিশ্চিত করতে কেমিস্টের কাউন্টার স্টাফ ট্রেনিং।",
        status: "not_started",
        videoCount: 1,
        guideCount: 1,
        audioCount: 0,
        materials: [
          {
            id: "counter-substitution-video",
            type: "video",
            title: "কাউন্টার সাবস্টিটিউশন প্রতিরোধ কৌশল",
            meta: "7 mins",
            filename: "Counter_Substitution_Prevention.mp4",
          },
          {
            id: "chemist-staff-training-guide",
            type: "pdf",
            title: "কেমিস্ট কাউন্টার স্টাফ ট্রেনিং গাইড",
            meta: "4 pages",
            filename: "Chemist_Staff_Training_Guide.pdf",
          },
        ],
        scenario: {
          clientInitials: "কা",
          clientName: "মোঃ কামরুল ইসলাম",
          clientTitle: "প্রধান কেমিস্ট, সেবা ফার্মেসি",
          objection: "প্রেসক্রিপশন এলেই তো স্টক রাখব, আগে থেকে টাকা আটকে রাখতে পারব না ভাই।",
          objective:
            "কেমিস্ট কামরুল ইসলাম আগাম স্টক রাখতে অনিচ্ছুক। আপনার লক্ষ্য কাউন্টার সাবস্টিটিউশন প্রতিরোধ ও বিক্রয় নিশ্চয়তা দেখিয়ে তাঁকে সামান্য স্টক রাখতে রাজি করানো।",
          criteria: [
            "কেমিস্টের আর্থিক ঝুঁকির উদ্বেগ বুঝে সহানুভূতির সাথে সাড়া দেওয়া।",
            "আশেপাশের ডাক্তারদের নিয়মিত প্রেসক্রিপশনের তথ্য দিয়ে চাহিদা নিশ্চিত করা।",
            "ছোট পরিমাণে ট্রায়াল স্টক রাখার একটি সুনির্দিষ্ট প্রস্তাব দেওয়া।",
          ],
        },
      },
      {
        id: "long-term-relationship",
        title: "চ্যাপ্টার ২: কেমিস্টদের সাথে দীর্ঘমেয়াদী বাণিজ্যিক সম্পর্ক",
        description: "নিয়মিত স্টক অর্ডার ও পারস্পরিক আস্থার ভিত্তিতে দীর্ঘমেয়াদী পার্টনারশিপ গড়ে তোলা।",
        status: "not_started",
        videoCount: 0,
        guideCount: 1,
        audioCount: 1,
        materials: [
          {
            id: "long-term-partnership-checklist",
            type: "pdf",
            title: "দীর্ঘমেয়াদী পার্টনারশিপ চেকলিস্ট",
            meta: "3 pages",
            filename: "Long_Term_Partnership_Checklist.pdf",
          },
          {
            id: "chemist-partnership-case-study",
            type: "audio",
            title: "সফল কেমিস্ট পার্টনারশিপের কেস স্টাডি",
            meta: "5 mins",
            filename: "Chemist_Partnership_Case_Study.mp3",
          },
        ],
        scenario: {
          clientInitials: "রে",
          clientName: "মোছাঃ রেহানা বেগম",
          clientTitle: "স্বত্বাধিকারী, নিউ লাইফ ফার্মেসি",
          objection: "আপনাদের কোম্পানি তো ঘন ঘন এমআর পরিবর্তন করে, সম্পর্ক রাখব কীভাবে?",
          objective:
            "রেহানা বেগমের অতীত অভিজ্ঞতা ভালো নয়। আপনার লক্ষ্য নিয়মিত যোগাযোগ ও নির্ভরযোগ্যতার আশ্বাস দিয়ে দীর্ঘমেয়াদী আস্থা তৈরি করা।",
          criteria: [
            "অতীতের নেতিবাচক অভিজ্ঞতাকে অস্বীকার না করে বোঝার চেষ্টা করা।",
            "নিয়মিত ভিজিট ও যোগাযোগের একটি স্পষ্ট প্রতিশ্রুতি দেওয়া।",
            "পারস্পরিক লাভজনক দীর্ঘমেয়াদী সম্পর্কের সুনির্দিষ্ট সুবিধা তুলে ধরা।",
          ],
        },
      },
    ],
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
    examId: "competitor-objection-final",
    chapters: [
      {
        id: "brand-loyalty-root-cause",
        title: "চ্যাপ্টার ১: ব্র্যান্ড আনুগত্যের মূল কারণ বোঝা",
        description: "ডাক্তার কেন প্রতিষ্ঠিত ব্র্যান্ড ছাড়ছেন না তার প্রকৃত কারণ চিহ্নিত করার কৌশল।",
        status: "completed",
        videoCount: 1,
        guideCount: 1,
        audioCount: 0,
        materials: [
          {
            id: "brand-loyalty-psychology-video",
            type: "video",
            title: "ব্র্যান্ড আনুগত্যের মনস্তত্ত্ব",
            meta: "9 mins",
            filename: "Brand_Loyalty_Psychology.mp4",
          },
          {
            id: "root-cause-framework",
            type: "pdf",
            title: "মূল কারণ বিশ্লেষণ ফ্রেমওয়ার্ক",
            meta: "4 pages",
            filename: "Root_Cause_Framework.pdf",
          },
        ],
        scenario: {
          clientInitials: "ডা",
          clientName: "ডা. আরিফ হোসেন",
          clientTitle: "কনসালট্যান্ট কার্ডিওলজিস্ট, ন্যাশনাল হার্ট ফাউন্ডেশন",
          objection: "আমি ১০ বছর ধরে এই ব্র্যান্ড লিখছি, রোগীরাও ভালো আছে। পরিবর্তনের কোনো কারণ দেখছি না।",
          objective:
            "ডা. আরিফ হোসেনের দীর্ঘদিনের ব্র্যান্ড আনুগত্য আছে। আপনার লক্ষ্য বিনয়ের সাথে প্রশ্ন করে তাঁর আনুগত্যের প্রকৃত কারণ বোঝা।",
          criteria: [
            "সরাসরি তর্ক না করে বিনয়ের সাথে জিজ্ঞাসা করে আনুগত্যের কারণ অনুসন্ধান করা।",
            "ডাক্তারের অভিজ্ঞতা ও সিদ্ধান্তকে সম্মান জানানো।",
            "কথোপকথনকে আক্রমণাত্মক না করে তথ্য সংগ্রহের দিকে রাখা।",
          ],
        },
      },
      {
        id: "clinical-evidence-switch",
        title: "চ্যাপ্টার ২: নতুন ক্লিনিক্যাল প্রমাণ দিয়ে ব্র্যান্ড সুইচ করানো",
        description: "নতুন ট্রায়াল ডেটা ও রোগীর ফলাফল দেখিয়ে নিরাপদে ব্র্যান্ড পরিবর্তনে রাজি করানো।",
        status: "in_progress",
        videoCount: 1,
        guideCount: 1,
        audioCount: 1,
        materials: [
          {
            id: "clinical-trial-presentation-video",
            type: "video",
            title: "ক্লিনিক্যাল ট্রায়াল ডেটা উপস্থাপন কৌশল",
            meta: "11 mins",
            filename: "Clinical_Trial_Presentation.mp4",
          },
          {
            id: "new-formulation-trial-data",
            type: "pdf",
            title: "নতুন ফর্মুলেশন ট্রায়াল ডেটা শিট",
            meta: "5 pages",
            filename: "New_Formulation_Trial_Data.pdf",
          },
          {
            id: "brand-switch-call-sample",
            type: "audio",
            title: "সফল ব্র্যান্ড সুইচ কল স্যাম্পল",
            meta: "4 mins",
            filename: "Brand_Switch_Call_Sample.mp3",
          },
        ],
        scenario: {
          clientInitials: "ডা",
          clientName: "ডা. আরিফ হোসেন",
          clientTitle: "কনসালট্যান্ট কার্ডিওলজিস্ট, ন্যাশনাল হার্ট ফাউন্ডেশন",
          objection: "শুধু কাগজে-কলমে ডেটা দেখে আমি আমার প্রমাণিত চিকিৎসা পদ্ধতি বদলাব না।",
          objective:
            "ডা. আরিফ হোসেন প্রমাণ ছাড়া পরিবর্তনে রাজি নন। আপনার লক্ষ্য নতুন ক্লিনিক্যাল ট্রায়াল ডেটা দেখিয়ে অন্তত একজন রোগীর জন্য ট্রায়াল প্রেসক্রিপশন আদায় করা।",
          criteria: [
            "নতুন ফর্মুলেশনের ট্রায়াল ডেটা স্পষ্ট ও বিশ্বাসযোগ্যভাবে উপস্থাপন করা।",
            "সরাসরি ব্র্যান্ড পরিবর্তনের বদলে একজন উপযুক্ত রোগীর জন্য ট্রায়ালের প্রস্তাব দেওয়া।",
            "ঝুঁকি কম দেখিয়ে ডাক্তারকে নিরাপদ বোধ করানো।",
          ],
        },
      },
    ],
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
    examId: "compliance-final",
    chapters: [
      {
        id: "dgda-indication",
        title: "চ্যাপ্টার ১: DGDA নির্দেশিকা ও সঠিক ইনডিকেশন উপস্থাপন",
        description: "নৈতিক প্রচার নীতি বজায় রেখে অনুমোদিত ইনডিকেশনের বাইরে না গিয়ে ওষুধ উপস্থাপনের নিয়ম।",
        status: "completed",
        videoCount: 1,
        guideCount: 1,
        audioCount: 0,
        materials: [
          {
            id: "dgda-guidelines-video",
            type: "video",
            title: "DGDA নির্দেশিকা ও নৈতিক প্রচার নীতি",
            meta: "10 mins",
            filename: "DGDA_Guidelines_Ethics.mp4",
          },
          {
            id: "approved-indication-reference",
            type: "pdf",
            title: "অনুমোদিত ইনডিকেশন রেফারেন্স শিট",
            meta: "6 pages",
            filename: "Approved_Indication_Reference.pdf",
          },
        ],
        scenario: {
          clientInitials: "ডা",
          clientName: "ডা. শাহরিয়ার কবির",
          clientTitle: "মেডিকেল অফিসার, ঢাকা মেডিকেল কলেজ হাসপাতাল",
          objection: "একটু বাড়িয়ে অফ-লেবেল ইনডিকেশনের কথা বললে কী সমস্যা? রোগীর তো উপকারই হবে।",
          objective:
            "ডা. শাহরিয়ার কবির অতিরিক্ত দাবির প্রতি আগ্রহী। আপনার লক্ষ্য নৈতিক প্রচার নীতি বজায় রেখে শুধুমাত্র অনুমোদিত ইনডিকেশন উপস্থাপন করা।",
          criteria: [
            "অফ-লেবেল দাবি প্রত্যাখ্যান করে শুধুমাত্র DGDA অনুমোদিত ইনডিকেশন উপস্থাপন করা।",
            "নৈতিক অবস্থান বজায় রেখেও পেশাদার ও সম্মানজনক সুরে কথা বলা।",
            "অনুমোদিত তথ্যের মধ্যেই ওষুধের প্রকৃত সুবিধা কার্যকরভাবে তুলে ধরা।",
          ],
        },
      },
    ],
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
    chapters: [
      {
        id: "identify-influencers",
        title: "চ্যাপ্টার ১: প্রভাবশালী চিকিৎসক চিহ্নিতকরণ",
        description: "অঞ্চলভিত্তিক প্রভাবশালী ও মতামত-নির্ধারক চিকিৎসকদের ম্যাপিং করার পদ্ধতি।",
        status: "not_started",
        videoCount: 1,
        guideCount: 0,
        audioCount: 0,
        materials: [
          {
            id: "influencer-mapping-video",
            type: "video",
            title: "প্রভাবশালী চিকিৎসক ম্যাপিং পদ্ধতি",
            meta: "8 mins",
            filename: "Influencer_Mapping_Method.mp4",
          },
        ],
        scenario: {
          clientInitials: "তা",
          clientName: "ডা. তাহমিনা আক্তার",
          clientTitle: "বিভাগীয় প্রধান, মেডিসিন বিভাগ, কুমিল্লা মেডিকেল কলেজ",
          objection: "আপনারা কেন হঠাৎ আমার সাথে যোগাযোগ করতে চাইছেন? আমার তো নির্দিষ্ট কোম্পানির সাথেই কাজ চলছে।",
          objective:
            "ডা. তাহমিনা আক্তার একজন প্রভাবশালী KOL। আপনার লক্ষ্য পেশাদারভাবে পরিচিত হয়ে দীর্ঘমেয়াদী সম্পর্কের ভিত্তি স্থাপন করা।",
          criteria: [
            "পেশাদার ও সম্মানজনকভাবে প্রথম পরিচিতি সম্পন্ন করা।",
            "তাৎক্ষণিক বিক্রয়ের চাপ না দিয়ে সম্পর্ক গড়ার আগ্রহ প্রকাশ করা।",
            "ডাক্তারের সময়ের মূল্য দিয়ে সংক্ষিপ্ত ও কার্যকর কথোপকথন করা।",
          ],
        },
      },
      {
        id: "long-term-relationship-kol",
        title: "চ্যাপ্টার ২: দীর্ঘমেয়াদী সম্পর্ক গড়ে তোলার কৌশল",
        description: "নিয়মিত ফলো-আপ ও মূল্য সংযোজনের মাধ্যমে বিশ্বস্ত পেশাদার সম্পর্ক নির্মাণ।",
        status: "not_started",
        videoCount: 0,
        guideCount: 1,
        audioCount: 0,
        materials: [
          {
            id: "kol-relationship-management",
            type: "pdf",
            title: "KOL সম্পর্ক ব্যবস্থাপনা গাইড",
            meta: "4 pages",
            filename: "KOL_Relationship_Management.pdf",
          },
        ],
        scenario: {
          clientInitials: "তা",
          clientName: "ডা. তাহমিনা আক্তার",
          clientTitle: "বিভাগীয় প্রধান, মেডিসিন বিভাগ, কুমিল্লা মেডিকেল কলেজ",
          objection: "আপনারা শুধু প্রয়োজনে যোগাযোগ করেন, নিয়মিত খোঁজ তো নেন না।",
          objective:
            "ডা. তাহমিনা আক্তারের অভিযোগ ধারাবাহিকতার অভাব নিয়ে। আপনার লক্ষ্য নিয়মিত ফলো-আপের একটি বিশ্বাসযোগ্য পরিকল্পনা উপস্থাপন করা।",
          criteria: [
            "অতীতের অনিয়মিত যোগাযোগের অভিযোগ স্বীকার করে দায়িত্ব নেওয়া।",
            "একটি সুনির্দিষ্ট ও বাস্তবসম্মত নিয়মিত যোগাযোগের পরিকল্পনা প্রস্তাব করা।",
            "শুধু বিক্রয় নয়, মূল্য সংযোজনের মাধ্যমে সম্পর্ক গড়ার আন্তরিকতা দেখানো।",
          ],
        },
      },
      {
        id: "conference-presentation",
        title: "চ্যাপ্টার ৩: মেডিকেল কনফারেন্সে ব্র্যান্ড উপস্থাপনা",
        description: "কনফারেন্স ও সিম্পোজিয়ামে পেশাদারভাবে ব্র্যান্ড ও ক্লিনিক্যাল ডেটা উপস্থাপনের কৌশল।",
        status: "not_started",
        videoCount: 1,
        guideCount: 1,
        audioCount: 1,
        materials: [
          {
            id: "conference-presentation-video",
            type: "video",
            title: "কনফারেন্স উপস্থাপনা কৌশল",
            meta: "10 mins",
            filename: "Conference_Presentation_Skills.mp4",
          },
          {
            id: "symposium-slide-template",
            type: "pdf",
            title: "সিম্পোজিয়াম স্লাইড টেমপ্লেট গাইড",
            meta: "3 pages",
            filename: "Symposium_Slide_Template.pdf",
          },
          {
            id: "successful-presentation-recording",
            type: "audio",
            title: "সফল কনফারেন্স উপস্থাপনার রেকর্ডিং",
            meta: "7 mins",
            filename: "Successful_Presentation_Recording.mp3",
          },
        ],
        scenario: {
          clientInitials: "তা",
          clientName: "ডা. তাহমিনা আক্তার",
          clientTitle: "বিভাগীয় প্রধান, মেডিসিন বিভাগ, কুমিল্লা মেডিকেল কলেজ",
          objection: "কনফারেন্সে আপনাদের প্রেজেন্টেশন তো সবসময় বিক্রয়মুখী মনে হয়, একাডেমিক মান কম।",
          objective:
            "ডা. তাহমিনা আক্তার একাডেমিক মান নিয়ে সন্দিহান। আপনার লক্ষ্য একটি বিজ্ঞানসম্মত ও একাডেমিক মানসম্পন্ন উপস্থাপনার পরিকল্পনা বিশ্বাসযোগ্যভাবে তুলে ধরা।",
          criteria: [
            "উপস্থাপনায় বিক্রয়মুখী ভাষা এড়িয়ে একাডেমিক ও ক্লিনিক্যাল ডেটার ওপর জোর দেওয়া।",
            "নির্ভরযোগ্য সূত্র ও গবেষণার রেফারেন্স উল্লেখ করার প্রতিশ্রুতি দেওয়া।",
            "ডাক্তারের একাডেমিক মান সম্পর্কিত উদ্বেগকে সরাসরি ও সম্মানের সাথে সমাধান করা।",
          ],
        },
      },
    ],
  },
];
