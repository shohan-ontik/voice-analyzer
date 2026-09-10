// Chapter titles are stored as "চ্যাপ্টার ১: ..." — this strips that prefix
// for display contexts that show the chapter number as their own badge
// instead.
export function chapterHeadline(title: string) {
  return title.replace(/^চ্যাপ্টার\s*[০-৯0-9]+\s*[:ঃ]\s*/, "");
}
