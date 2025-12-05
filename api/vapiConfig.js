import { getNumericUrgencyAssessment } from "./services/groqService.js";

/**
 * Static configuration for the SehatSathi medical triage voice assistant.
 * This can be used when creating a Vapi assistant or scenario.
 */
export const triageAssistantConfig = {
  name: "SehatSathi Triage Assistant",
  languages: ["en-IN", "hi-IN"],
  voice: {
    // Placeholder values – customize with a real Vapi voice ID if needed.
    provider: "vapi-default",
    accent: "indian",
    gender: "female",
  },
  behavior: {
    systemPrompt:
      "You are SehatSathi, a calm and empathetic medical triage assistant. " +
      "You speak both Hindi and English, and you may mix simple Hindi and English phrases " +
      "to make patients comfortable. You are NOT a doctor and cannot provide a diagnosis. " +
      "Your job is to ask triage questions clearly, confirm details, and summarize key risks. " +
      "If symptoms suggest a life‑threatening emergency, clearly advise the patient to seek " +
      "immediate medical attention or call local emergency services.",
    questions: [
      {
        id: "symptoms",
        textEn: "Describe your symptoms.",
        textHi: "Apne lakshan batayein. Aapko kya takleef ho rahi hai?",
      },
      {
        id: "onset",
        textEn: "When did this start?",
        textHi: "Yeh takleef kab se shuru hui?",
      },
      {
        id: "severity",
        textEn: "On a scale of 1 to 10, how severe is the pain?",
        textHi: "1 se 10 ke scale par dard kitna tez hai?",
      },
      {
        id: "redFlags",
        textEn:
          "Do you have fever, breathing difficulty, or chest pain? Please describe.",
        textHi:
          "Kya aapko bukhaar, saans lene mein takleef, ya seene mein dard hai? Kripya batayein.",
      },
    ],
  },
};

/**
 * Helper that Vapi (or your webhook) can call to analyze a completed
 * triage conversation with Groq and return an urgency level from 1–5.
 *
 * @param {object} payload - e.g. { transcript, answers, metadata }
 */
export async function analyzeTriageWithGroq(payload) {
  // Shape the conversation object that we send to Groq
  const conversation = {
    transcript: payload.transcript ?? "",
    answers: payload.answers ?? {},
    meta: {
      patientId: payload.patientId ?? null,
      language: payload.language ?? "mixed-hi-en",
      source: "vapi-voice-assistant",
    },
  };

  const result = await getNumericUrgencyAssessment(conversation);

  return {
    urgency: result.urgency, // 1–5
    reasoning: result.reasoning,
  };
}


