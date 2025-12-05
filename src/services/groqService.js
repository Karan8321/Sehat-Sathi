const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Call Groq LLM to get a triage assessment.
 * Returns a structured object: { urgencyLevel, advice, rawResponse }
 */
export async function getTriageAssessment(input) {
  const apiKey = process.env.GROQ_API_KEY;
  // Default to a currently supported Groq model; can be overridden via GROQ_MODEL in .env
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  if (!apiKey) {
    const error = new Error("GROQ_API_KEY is not configured");
    error.status = 500;
    throw error;
  }

  const systemPrompt =
    "You are a medical triage assistant. You are not a doctor and cannot provide a diagnosis. " +
    "Classify urgency into one of: 'emergency', 'urgent', or 'non-urgent'. " +
    "Always recommend calling emergency services for life-threatening symptoms. " +
    "Respond with concise, patient-friendly language.";

  const userDescription = JSON.stringify(input, null, 2);

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content:
          "Here is the patient triage information. " +
          "Return JSON with keys: urgencyLevel (emergency|urgent|non-urgent), advice (string).\n\n" +
          userDescription,
      },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  };

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const error = new Error(
      `Groq API error: ${response.status} ${response.statusText}`
    );
    error.status = 502;
    error.details = text;
    throw error;
  }

  const data = await response.json();
  const content =
    data?.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {
      urgencyLevel: "non-urgent",
      advice: content,
    };
  }

  return {
    urgencyLevel: parsed.urgencyLevel || "non-urgent",
    advice: parsed.advice || "No advice available.",
    rawResponse: data,
  };
}

/**
 * Analyze a triage conversation and return numeric urgency (1-5).
 * 1 = lowest urgency, 5 = highest / emergency.
 */
export async function getNumericUrgencyAssessment(conversation) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  if (!apiKey) {
    const error = new Error("GROQ_API_KEY is not configured");
    error.status = 500;
    throw error;
  }

  const systemPrompt =
    "You are a medical triage assistant helping nurses prioritize patients. " +
    "You are not a doctor and cannot provide a diagnosis. " +
    "Based on the conversation transcript and answers, assign an urgency score from 1 to 5, " +
    "where 1 = routine / non-urgent, 3 = moderate / should be seen soon, " +
    "and 5 = life-threatening emergency. " +
    "Use score 5 ONLY for clearly life-threatening patterns such as: severe chest pain, " +
    "severe difficulty breathing, confusion or not making sense, unresponsiveness or fainting, " +
    "severe bleeding, or major trauma (e.g., head injury, multiple injuries). " +
    "Simple fever without red-flag symptoms (no breathing difficulty, chest pain, confusion, " +
    "severe dehydration, or other emergency signs) should usually be 1 or 2, and at most 3 if " +
    "there are worrying additional symptoms. " +
    "Be conservative in favor of patient safety, but avoid using 5 for routine infections or mild fever. " +
    "Return ONLY JSON with keys: urgency (1-5 integer), reasoning (string).";

  const userContent = JSON.stringify(conversation, null, 2);

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content:
          "Here is the conversation and patient answers to triage questions. " +
          "Analyze and respond with JSON as described:\n\n" +
          userContent,
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  };

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const error = new Error(
      `Groq API error: ${response.status} ${response.statusText}`
    );
    error.status = 502;
    error.details = text;
    throw error;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {
      urgency: 3,
      reasoning: content,
    };
  }

  const urgency = Math.min(
    5,
    Math.max(1, Number(parsed.urgency) || 3)
  );

  return {
    urgency,
    reasoning: parsed.reasoning || "No reasoning provided.",
    rawResponse: data,
  };
}

/**
 * Single conversational turn with Groq as a triage assistant.
 *
 * Input: array of { role: "user" | "assistant", content: string }
 * Output: {
 *   reply: string;                 // assistant's next message to show in chat
 *   urgencyLevel: string;          // emergency | urgent | non-urgent
 *   numericUrgency: number;        // 1–5
 *   advice: string;                // short guidance text
 *   rawResponse: any;
 * }
 */
export async function chatTriageTurn(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  if (!apiKey) {
    const error = new Error("GROQ_API_KEY is not configured");
    error.status = 500;
    throw error;
  }

  const systemPrompt =
    "You are a medical triage assistant. You MUST respond in PLAIN ENGLISH ONLY. " +
    "Never use Hindi or any other language. No translations. No bilingual responses. " +
    "You are NOT a doctor and cannot provide a diagnosis. " +
    "Have a short conversation to understand symptoms, using clear and simple English only. " +
    "Ask at most 3 short follow-up questions before giving your overall guidance. " +
    "Follow-up questions MUST depend on the specific symptoms and previous answers for this patient. " +
    "Do NOT ask the same fixed set of questions for every patient. Instead, focus on red-flag features that would change urgency, " +
    "such as chest pain, breathing difficulty, confusion, severe pain, trauma, or bleeding. " +
    "Be calm, empathetic, and concise. " +
    "After analyzing the conversation, classify urgency as: 'emergency', 'urgent', or 'non-urgent', " +
    "and assign a numericUrgency from 1 to 5 (1 = routine/low, 3 = moderate, 5 = life-threatening). " +
    "Use numericUrgency = 5 ONLY for clearly life-threatening situations such as: severe chest pain, " +
    "severe difficulty breathing, confusion or not making sense, unresponsiveness or fainting, " +
    "severe bleeding, or major trauma (for example, serious head injury or multiple injuries). " +
    "Simple fever without emergency signs (no breathing difficulty, chest pain, confusion, " +
    "or severe dehydration) should usually be scored 1 or 2, and at most 3 if there are additional worrying symptoms. " +
    "Be conservative in favor of patient safety, but avoid using 5 for routine infections or mild fever. " +
    "Return ONLY JSON with: reply (string, in English only), urgencyLevel, numericUrgency, advice (in English only).";

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  };

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const error = new Error(
      `Groq API error: ${response.status} ${response.statusText}`
    );
    error.status = 502;
    error.details = text;
    throw error;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {
      reply: content,
      urgencyLevel: "non-urgent",
      numericUrgency: 3,
      advice: "Could not read full structured response, but stay safe and seek a clinician if worried.",
    };
  }

  const numericUrgency = Math.min(
    5,
    Math.max(1, Number(parsed.numericUrgency) || 3)
  );

  return {
    reply: parsed.reply || "I am here to help. Please describe how you are feeling.",
    urgencyLevel: parsed.urgencyLevel || "non-urgent",
    numericUrgency,
    advice:
      parsed.advice ||
      "If your symptoms worsen, please visit the nearest hospital or call emergency services.",
    rawResponse: data,
  };
}

