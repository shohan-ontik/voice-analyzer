export type ScenarioKey = "cold" | "demo" | "objection" | "elevator";

export const SCENARIOS: { key: ScenarioKey; label: string }[] = [
  { key: "cold", label: "Cold Call" },
  { key: "demo", label: "Product Demo" },
  { key: "objection", label: "Objection Handling" },
  { key: "elevator", label: "Elevator Pitch" },
];

export const PITCH_PASSAGE_BN =
  "আমাদের নতুন প্রোডাক্ট আপনার ব্যবসার কাজ আরও সহজ করে তুলবে। এটি ব্যবহার করা যেমন সহজ, তেমনই কার্যকর। প্রতিদিন হাজারো মানুষ এটি ব্যবহার করে সময় ও খরচ দুটোই বাঁচাচ্ছেন। আজই আমাদের সাথে যুক্ত হয়ে আপনার ব্যবসাকে নিয়ে যান এক নতুন উচ্চতায়।";
