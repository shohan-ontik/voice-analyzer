import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import {
  ANALYSIS_JSON_SCHEMA,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  buildAnalysisPrompt,
  type AnalysisResult,
} from "@/app/lib/analysis";

export const runtime = "nodejs";
export const maxDuration = 60;

function transcodeToWav(input: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("ffmpeg binary not found"));
      return;
    }
    const proc = spawn(ffmpegPath, [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      "pipe:0",
      "-ac",
      "1",
      "-ar",
      "16000",
      "-f",
      "wav",
      "pipe:1",
    ]);
    const chunks: Buffer[] = [];
    let stderr = "";
    proc.stdout.on("data", (c: Buffer) => chunks.push(c));
    proc.stderr.on("data", (c: Buffer) => {
      stderr += c.toString();
    });
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
    });
    proc.stdin.write(input);
    proc.stdin.end();
  });
}

function normalize(raw: unknown): AnalysisResult {
  const r = raw as Partial<AnalysisResult> & Record<string, unknown>;
  const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

  const byKey = new Map((Array.isArray(r.categories) ? r.categories : []).map((c) => [c?.key, c]));
  const categories = CATEGORY_ORDER.map((key) => {
    const c = byKey.get(key) as Partial<AnalysisResult["categories"][number]> | undefined;
    return {
      key,
      name: CATEGORY_LABELS[key],
      score: clamp(c?.score),
      feedback: typeof c?.feedback === "string" ? c.feedback : "No feedback available.",
      tips: Array.isArray(c?.tips) ? c!.tips!.filter((t) => typeof t === "string").slice(0, 3) : [],
    };
  });

  const overall = Number.isFinite(r.overall)
    ? clamp(r.overall)
    : clamp(categories.reduce((s, c) => s + c.score, 0) / categories.length);

  const transcript = Array.isArray(r.transcript)
    ? r.transcript
        .filter((s) => s && typeof s.text === "string")
        .map((s) => ({
          text: s.text as string,
          kind: (["plain", "filler", "pronunciation"] as const).includes(s.kind as never)
            ? (s.kind as "plain" | "filler" | "pronunciation")
            : "plain",
        }))
    : [];

  return {
    overall,
    verdict: typeof r.verdict === "string" ? r.verdict : "Analysis complete.",
    categories,
    transcript,
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GEMINI_API_KEY. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const mode = formData.get("mode");
  const passage = formData.get("passage");
  const scenario = formData.get("scenario");

  if (
    !(file instanceof Blob) ||
    (mode !== "audio" && mode !== "video") ||
    typeof passage !== "string" ||
    typeof scenario !== "string" ||
    !passage ||
    !scenario
  ) {
    return NextResponse.json({ error: "Missing or invalid form fields." }, { status: 400 });
  }

  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());
    let data: string;
    let mimeType: string;
    let partType: "audio" | "video";

    if (mode === "audio") {
      const wav = await transcodeToWav(inputBuffer);
      data = wav.toString("base64");
      mimeType = "audio/wav";
      partType = "audio";
    } else {
      data = inputBuffer.toString("base64");
      mimeType = "video/webm";
      partType = "video";
    }

    const ai = new GoogleGenAI({ apiKey });
    const interaction = await ai.interactions.create({
      model: "gemini-3.7-flash",
      input: [
        { type: "text", text: buildAnalysisPrompt(passage, scenario) },
        { type: partType, data, mime_type: mimeType },
      ],
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: ANALYSIS_JSON_SCHEMA,
      },
    });

    if (!interaction.output_text) {
      throw new Error("Gemini returned no output.");
    }
    const parsed = JSON.parse(interaction.output_text);
    return NextResponse.json(normalize(parsed));
  } catch (err) {
    console.error("Gemini analysis failed:", err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 502 });
  }
}
