import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { buildAnalysisPrompt, buildAnalysisSchema, type AnalysisResult } from "@/app/lib/analysis";
import { listActiveScoreCategoryNames } from "@/app/lib/apiClient";
import { getSessionToken } from "@/app/lib/session";

export const runtime = "nodejs";
export const maxDuration = 60;

// The @google/genai SDK sometimes wraps the real error in `.cause`, so check
// both levels for the shape Gemini uses on 429s (statusCode/error.code) plus
// a message fallback in case that shape changes.
function isQuotaError(err: unknown): boolean {
  return [err, err instanceof Error ? err.cause : undefined].some((candidate) => {
    if (!candidate || typeof candidate !== "object") return false;
    const e = candidate as Record<string, unknown>;
    if (e.statusCode === 429) return true;
    if ((e.error as Record<string, unknown> | undefined)?.code === "too_many_requests") return true;
    return typeof e.message === "string" && /quota|rate.?limit/i.test(e.message);
  });
}

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

function normalize(raw: unknown, categoryNames: string[]): AnalysisResult {
  const r = raw as Partial<AnalysisResult> & Record<string, unknown>;
  const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

  const byName = new Map(
    (Array.isArray(r.categories) ? r.categories : []).map((c) => [c?.name, c])
  );
  const categories = categoryNames.map((name) => {
    const c = byName.get(name) as Partial<AnalysisResult["categories"][number]> | undefined;
    return {
      name,
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

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const mode = formData.get("mode");
  const passage = formData.get("passage");
  const topicName = formData.get("topicName");

  if (
    !(file instanceof Blob) ||
    (mode !== "audio" && mode !== "video") ||
    typeof passage !== "string" ||
    typeof topicName !== "string" ||
    !passage ||
    !topicName
  ) {
    return NextResponse.json({ error: "Missing or invalid form fields." }, { status: 400 });
  }

  try {
    const { items: activeCategories } = await listActiveScoreCategoryNames(token);
    const categoryNames = activeCategories.map((c) => c.name);
    if (categoryNames.length === 0) {
      return NextResponse.json(
        { error: "No active scoring categories are configured. Ask an admin to enable at least one." },
        { status: 400 }
      );
    }

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
        { type: "text", text: buildAnalysisPrompt(passage, topicName, categoryNames) },
        { type: partType, data, mime_type: mimeType },
      ],
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: buildAnalysisSchema(categoryNames),
      },
    });

    if (!interaction.output_text) {
      throw new Error("Gemini returned no output.");
    }
    const parsed = JSON.parse(interaction.output_text);
    const result = normalize(parsed, categoryNames);

    // Not persisted here - the user reviews the results first and the
    // practice session is only written to their history when they press
    // "Save & Continue" (see POST /api/sessions).
    return NextResponse.json(result);
  } catch (err) {
    console.error("Gemini analysis failed:", err);
    if (isQuotaError(err)) {
      return NextResponse.json(
        {
          error:
            "The AI scoring service has hit its usage limit for now. Please wait a minute and try again, or ask an admin to check the Gemini API plan.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 502 });
  }
}
