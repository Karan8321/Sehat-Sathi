import fetch from "node-fetch";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Call Groq LLM to get a triage assessment.
 * Returns a structured object: { urgencyLevel, advice, rawResponse }
 */
export async function getTriageAssessment(input) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";

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
  const model = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";

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
    "Always be conservative in favor of patient safety. " +
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

