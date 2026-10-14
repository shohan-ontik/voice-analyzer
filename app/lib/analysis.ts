export type AnalysisCategory = {
  name: string;
  score: number;
  feedback: string;
  tips: string[];
};

export type TranscriptKind = "plain" | "filler" | "pronunciation";

export type TranscriptSegment = {
  text: string;
  kind: TranscriptKind;
};

export type AnalysisResult = {
  overall: number;
  verdict: string;
  categories: AnalysisCategory[];
  transcript: TranscriptSegment[];
};

// The overall score shown to users is the rounded average of the category
// scores, computed here: the model's own `overall` drifted by up to 11 points
// from its category scores in testing.
export function overallScore(categories: { score: number }[]) {
  if (categories.length === 0) return 0;
  return Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);
}

// Categories are admin-managed (see the admin panel's Categories page) and
// fetched from the backend at analysis time, so the schema/prompt below are
// built per-request from whichever names are currently active, rather than
// a fixed compile-time list.
export function buildAnalysisSchema(categoryNames: string[]) {
  return {
    type: "object",
    properties: {
      // Never shown (see overallScore) but still requested: without it the
      // model scores categories in isolation and a fluent but wrong,
      // off-topic or unethical pitch averaged 60-80 instead of ~25 in testing.
      overall: {
        type: "number",
        description: "Overall score 0-100, the rounded average of every category score.",
      },
      verdict: {
        type: "string",
        description: "One short, encouraging sentence summarizing the pitch quality, in Bangla.",
      },
      categories: {
        type: "array",
        description: `Exactly ${categoryNames.length} entries, one for each of, in this exact order: ${categoryNames.join(", ")}.`,
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              enum: categoryNames,
            },
            score: { type: "number", description: "0-100. 0 if the recording contains no intelligible speech." },
            feedback: { type: "string", description: "One specific sentence of feedback, in Bangla." },
            tips: {
              type: "array",
              items: { type: "string" },
              description: "Exactly two short, actionable tips referencing what was actually said, in Bangla.",
            },
          },
          required: ["name", "score", "feedback", "tips"],
        },
      },
      transcript: {
        type: "array",
        description:
          "The full transcription of what the speaker actually said, in Bangla, split into consecutive segments covering the entire recording (concatenating every segment's text reproduces the full transcript).",
        items: {
          type: "object",
          properties: {
            text: { type: "string", description: "The exact text of this segment." },
            kind: {
              type: "string",
              enum: ["plain", "filler", "pronunciation"],
              description:
                "'filler' for filler words/hesitations, 'pronunciation' for words that were mispronounced or unclear, 'plain' otherwise.",
            },
          },
          required: ["text", "kind"],
        },
      },
    },
    required: ["overall", "verdict", "categories", "transcript"],
  };
}

export function buildAnalysisPrompt(referenceFacts: string, scenarioLabel: string, categoryNames: string[]) {
  const categoryList = categoryNames.map((name) => `   - "${name}"`).join("\n");

  return `You are an expert sales-pitch coach evaluating a practice recording for the "${scenarioLabel}" pitch. Write every piece of feedback (verdict, category feedback, tips) entirely in Bangla, regardless of what language the speaker used in the recording.

Below are the key reference facts the speaker should convey about "${scenarioLabel}". This is NOT a script to recite verbatim — the speaker is expected to pitch in their own words, in their own order and structure:

"""
${referenceFacts}
"""

Watch or listen to the attached recording and:

1. Transcribe exactly what the speaker actually said in Bangla, split into short consecutive segments that together cover the entire recording. Transcribe only words you can actually hear in the recording — never fill in, guess, or reconstruct words from the reference facts above, and do not shorten or reword what was said. Tag each segment's "kind":
   - "filler" for filler words or hesitation sounds (e.g. "মানে", "আসলে", "উম", unnecessary repetitions) that add no content
   - "pronunciation" for words that were mispronounced, slurred, or unclear
   - "plain" for everything else

2. Score each of the following categories from 0-100, each with one sentence of specific feedback (in Bangla) and exactly two short, actionable tips (in Bangla) that reference what was actually said (not generic advice, and never asking for something the speaker already said). None of these categories should be scored on how closely the speaker's wording matches the reference facts above word-for-word. For any category about factual accuracy or completeness (e.g. "Correctness"), judge whether what the speaker actually said is factually accurate and covers the important points from the reference facts — in their own words, any order, paraphrased is fine — and only mark it down for facts that are missing, wrong, or invented. Judge every other category by its plain-English meaning in the context of a "${scenarioLabel}" pitch:
${categoryList}

3. Give an overall score (the rounded average of the category scores) and one encouraging, specific one-sentence verdict, in Bangla.

Be honest and specific, and score consistently: the same recording should always receive the same scores. If the recording contains no intelligible speech (silence, background noise only, or too short to evaluate), do NOT invent a pitch: set the transcript to a single segment describing what you actually heard, score every category 0, and explain why in the feedback (in Bangla).`;
}
