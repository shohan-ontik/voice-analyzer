// Builds the prompt/schema for generating a PitchScenario (see types.ts) with
// Gemini, grounded in a specific chapter's own title/description/materials
// rather than a fixed scenario, so each chapter gets a scenario that actually
// tests its content.
export function buildScenarioSchema() {
  return {
    type: "object",
    properties: {
      clientInitials: {
        type: "string",
        description: "Two initials (Bangla or Latin letters) for the client persona's name.",
      },
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
          "3 to 5 short evaluation criteria, in Bangla, specific to this chapter's content, used to judge whether the rep handled the roleplay well.",
      },
    },
    required: ["clientInitials", "clientName", "clientTitle", "objection", "objective", "criteria"],
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

Generate ONE realistic client persona and roleplay scenario, entirely in Bangla, that specifically tests the rep's understanding of the subject matter above. The client's objection/question must be directly grounded in this chapter's content (not generic small talk) so the rep has to actually apply what the chapter teaches to respond well. Vary the persona and phrasing so repeated generations for the same chapter feel like a different, fresh conversation rather than reusing the same client.`;
}
