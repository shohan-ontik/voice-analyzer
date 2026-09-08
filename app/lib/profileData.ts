// Static placeholder data for the profile page. Stands in for the future
// HR/LMS profile & training-progress API — no network calls here yet. The
// user's name is the only field on this page sourced from the real
// /api/auth/me endpoint; everything else here is a design placeholder.

export type ProfileStat = { label: string; value: string };

export type TrainingProgressItem = { skill: string; percent: number };

export type ProfileData = {
  employeeId: string;
  statusLabel: string;
  roleLabel: string;
  department: string;
  email: string;
  joinDate: string;
  avatarUrl: string;
  stats: ProfileStat[];
  trainingProgress: TrainingProgressItem[];
};

export const profileData: ProfileData = {
  employeeId: "EMP-1048",
  statusLabel: "আক্টিভ",
  roleLabel: "সেলস অফিসার",
  department: "Enterprise Sales",
  email: "nurul.islam@npoly.com",
  joinDate: "01/01/2023",
  avatarUrl: "https://picsum.photos/seed/employee-profile/300/300",
  stats: [
    { label: "কমপ্লিট চ্যাপ্টার", value: "12 / 18" },
    { label: "প্র্যাকটিস", value: "45" },
    { label: "পাস করা এক্সাম", value: "4" },
    { label: "গড় স্কোর", value: "88%" },
  ],
  trainingProgress: [
    { skill: "Communication Mastery", percent: 45 },
    { skill: "Product Fundamentals", percent: 100 },
    { skill: "Advanced Objection Handling", percent: 65 },
    { skill: "Ethics & Compliance", percent: 100 },
  ],
};
