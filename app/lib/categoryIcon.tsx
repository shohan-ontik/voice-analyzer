import type { ComponentType } from "react";
import { BrainIcon, PackageIcon, ShieldIcon, SparkleIcon, SpeakerIcon, TargetIcon } from "../components/icons";

type IconProps = { size?: number; className?: string };

// Score categories are admin-managed free text (see the admin panel's
// Categories page), so there's no fixed enum to switch on — match common
// keywords (English or Bangla) and fall back to a generic icon otherwise.
const KEYWORD_ICONS: [RegExp, ComponentType<IconProps>][] = [
  [/confidence|আত্মবিশ্বাস/i, BrainIcon],
  [/product|knowledge|জ্ঞান|প্রোডাক্ট/i, PackageIcon],
  [/objection|handling|আপত্তি|অবজেকশন/i, ShieldIcon],
  [/clarity|pronunciation|speech|উচ্চারণ|স্পষ্টতা/i, SpeakerIcon],
  [/goal|objective|target|উদ্দেশ্য|লক্ষ্য/i, TargetIcon],
];

export function getCategoryIcon(name: string): ComponentType<IconProps> {
  const match = KEYWORD_ICONS.find(([pattern]) => pattern.test(name));
  return match ? match[1] : SparkleIcon;
}
