import { apiErrorResponse, getModule } from "@/app/lib/apiClient";
import { buildScenarioPrompt, buildScenarioSchema } from "@/app/lib/scenarioGeneration";
import { getSessionToken } from "@/app/lib/session";
import type { PitchScenario } from "@/app/lib/types";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

function normalize(raw: unknown): PitchScenario {
  const r = raw as Partial<PitchScenario> & Record<string, unknown>;
  return {
    clientInitials: typeof r.clientInitials === "string" && r.clientInitials ? r.clientInitials.slice(0, 3) : "??",
    clientName: typeof r.clientName === "string" && r.clientName ? r.clientName : "অজানা ক্লায়েন্ট",
    clientTitle: typeof r.clientTitle === "string" ? r.clientTitle : "",
    objection: typeof r.objection === "string" ? r.objection : "",
    objective: typeof r.objective === "string" ? r.objective : "",
    criteria: Array.isArray(r.criteria) ? r.criteria.filter((c): c is string => typeof c === "string").slice(0, 6) : [],
  };
}

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string; chapterSlug: string }> }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: { message: "Server is missing GEMINI_API_KEY. Add it to .env.local and restart the dev server." } },
      { status: 500 }
    );
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  const { slug, chapterSlug } = await params;

  let trainingModule;
  try {
    trainingModule = await getModule(token, slug);
  } catch (err) {
    return apiErrorResponse(err, "Failed to load this module.");
  }

  const chapter = trainingModule.chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) {
    return NextResponse.json({ error: { message: "Chapter not found." } }, { status: 404 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const interaction = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: [
        {
          type: "text",
          text: buildScenarioPrompt(
            trainingModule.title,
            chapter.title,
            chapter.description,
            chapter.materials.map((m) => m.title)
          ),
        },
      ],
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: buildScenarioSchema(),
      },
    });

    if (!interaction.output_text) {
      throw new Error("Gemini returned no output.");
    }

    const scenario = normalize(JSON.parse(interaction.output_text));
    return NextResponse.json(scenario);
  } catch (err) {
    console.error("Scenario generation failed:", err);
    return NextResponse.json({ error: { message: "AI সিনারিও তৈরি করা যায়নি। আবার চেষ্টা করুন।" } }, { status: 502 });
  }
}
