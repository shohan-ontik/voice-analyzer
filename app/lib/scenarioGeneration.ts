// Builds the prompt/schema for generating a PitchScenario (see types.ts) with
// Gemini, grounded in a specific chapter's own title/description/materials
// rather than a fixed scenario, so each chapter gets a scenario that actually
// tests its content.
export function buildScenarioSchema() {
  return {
    type: "object",
    properties: {
      clientName: { type: "string", description: "A realistic full name for the client persona, in Bangla." },
      clientTitle: {
        type: "string",
        description: "The client persona's job title/role, in Bangla, relevant to the chapter's subject.",
      },
      objection: {
        type: "string",
        description:
          "One realistic objection or question, in Bangla, that this client would raise — grounded specifically in the facts/concepts covered by the chapter, not generic sales small talk.",
      },
      objective: {
        type: "string",
        description: "One or two sentences, in Bangla, describing what the rep must accomplish in this roleplay call.",
      },
      criteria: {
        type: "array",
        items: { type: "string" },
        description:
          "3 to 5 short evaluation criteria, in Bangla, specific to this chapter's content, used to judge whether the rep handled the roleplay well. Each must be observable from the rep's single recorded spoken reply.",
      },
    },
    required: ["clientName", "clientTitle", "objection", "objective", "criteria"],
  };
}

export function buildScenarioPrompt(
  moduleTitle: string,
  chapterTitle: string,
  chapterDescription: string,
  materialTitles: string[]
) {
  const materialsList = materialTitles.length
    ? materialTitles.map((t) => `   - ${t}`).join("\n")
    : "   (এই চ্যাপ্টারে কোনো নির্দিষ্ট শিখন উপাদান তালিকাভুক্ত নেই)";

  return `You are designing a sales roleplay practice scenario, entirely in Bangla, for a pharmaceutical/medical sales rep training app.

Module: "${moduleTitle}"
Chapter: "${chapterTitle}"
Chapter description: "${chapterDescription}"
Learning materials covered in this chapter:
${materialsList}

Generate ONE realistic client persona and roleplay scenario, entirely in Bangla, that specifically tests the rep's understanding of the subject matter above. The client's objection/question must be directly grounded in this chapter's content (not generic small talk) so the rep has to actually apply what the chapter teaches to respond well. Vary the persona and phrasing so repeated generations for the same chapter feel like a different, fresh conversation rather than reusing the same client.

The rep answers with a single one-way voice recording of up to two minutes — there is no back-and-forth with the client. So the objective and every evaluation criterion must be achievable and observable from that one spoken reply (e.g. not "asks follow-up questions and listens to the answers", and not "shows a graph or document").

Write in Bengali script only. Latin letters are fine for drug names, brand names and standard abbreviations (e.g. MUPS, PPI, DGDA), but never use any other script such as Devanagari.`;
}

const HONORIFICS =
  /^(ডাঃ|ডা[.:]?|ডঃ|ড\.|ডক্টর|অধ্যাপক|প্রফেসর|প্রফেঃ|সহযোগী|জনাব|বেগম|মোঃ|মো\.|মুহাঃ|শ্রী|Dr\.?|Prof\.?|Md\.?|Mr\.?|Mrs\.?|Ms\.?)$/i;

// Initials are derived from the generated name rather than asked of the
// model, which kept returning the "ডাঃ" honorific or mismatched letters.
// Bangla initials are the first code point of each word (the base letter,
// without its vowel sign), from the first and last name parts.
export function initialsFromName(name: string) {
  const words = name
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w && !HONORIFICS.test(w));
  if (words.length === 0) return "??";
  const first = [...words[0]][0];
  const last = words.length > 1 ? [...words[words.length - 1]][0] : "";
  return `${first}${last}`.toUpperCase();
}
