export type CategoryKey = "presentation" | "correctness" | "pronunciation" | "soft";

export type AnalysisCategory = {
  key: CategoryKey;
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

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  presentation: "Presentation",
  correctness: "Correctness",
  pronunciation: "Pronunciation",
  soft: "Soft Skills",
};

export const CATEGORY_ORDER: CategoryKey[] = ["presentation", "correctness", "pronunciation", "soft"];

export const ANALYSIS_JSON_SCHEMA = {
  type: "object",
  properties: {
    overall: {
      type: "number",
      description: "Overall score 0-100, the rounded average of the four category scores.",
    },
    verdict: {
      type: "string",
      description: "One short, encouraging sentence summarizing the pitch quality.",
    },
    categories: {
      type: "array",
      description:
        "Exactly four entries, in this exact order: presentation, correctness, pronunciation, soft.",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            enum: ["presentation", "correctness", "pronunciation", "soft"],
          },
          name: {
            type: "string",
            enum: ["Presentation", "Correctness", "Pronunciation", "Soft Skills"],
          },
          score: { type: "number", description: "0-100" },
          feedback: { type: "string", description: "One specific sentence of feedback." },
          tips: {
            type: "array",
            items: { type: "string" },
            description: "Exactly two short, actionable tips referencing what was actually said.",
          },
        },
        required: ["key", "name", "score", "feedback", "tips"],
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

export function buildAnalysisPrompt(passage: string, scenarioLabel: string) {
  return `You are an expert sales-pitch coach evaluating a practice recording for the "${scenarioLabel}" scenario.

The speaker was asked to read the following Bangla passage aloud as their pitch:

"""
${passage}
"""

Watch or listen to the attached recording and:

1. Transcribe exactly what the speaker actually said in Bangla, split into short consecutive segments that together cover the entire recording. Tag each segment's "kind":
   - "filler" for filler words or hesitation sounds (e.g. "মানে", "আসলে", "উম", unnecessary repetitions) that add no content
   - "pronunciation" for words that were mispronounced, slurred, or unclear
   - "plain" for everything else

2. Score four categories from 0-100, each with one sentence of specific feedback and exactly two short, actionable tips that reference what was actually said (not generic advice):
   - "presentation": confidence, pacing, tone, and structure of the delivery
   - "correctness": how accurately and completely the speaker conveyed the reference passage's content
   - "pronunciation": clarity and correctness of Bangla pronunciation
   - "soft" (Soft Skills): persuasiveness, warmth, and how appropriate the tone was for a "${scenarioLabel}" sales scenario

3. Give an overall score (the rounded average of the four category scores) and one encouraging, specific one-sentence verdict.

Be honest and specific. If the recording is silent, too short to evaluate, or does not contain a spoken pitch, still return the full JSON shape: score every category low, explain why in the feedback, and set the transcript to a single segment describing what you actually heard.`;
}
