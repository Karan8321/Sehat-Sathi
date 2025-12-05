import fetch from "node-fetch";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Very fast local fallback so we never block hospital matching
function heuristicSpecialties(symptomsText) {
  const text = (symptomsText || "").toLowerCase();
  const specialties = new Set();

  if (!text.trim()) {
    specialties.add("General Medicine");
    return Array.from(specialties);
  }

  if (
    text.includes("chest pain") ||
    text.includes("heart attack") ||
    text.includes("palpitation") ||
    text.includes("cardiac")
  ) {
    specialties.add("Cardiology");
  }

  if (
    text.includes("breath") ||
    text.includes("breathing") ||
    text.includes("asthma") ||
    text.includes("lung")
  ) {
    specialties.add("Pulmonology");
  }

  if (
    text.includes("stroke") ||
    text.includes("paralysis") ||
    text.includes("seizure") ||
    text.includes("fit") ||
    text.includes("weakness on one side")
  ) {
    specialties.add("Neurology");
  }

  if (
    text.includes("fracture") ||
    text.includes("broken bone") ||
    text.includes("joint pain") ||
    text.includes("back pain")
  ) {
    specialties.add("Orthopedics");
  }

  if (
    text.includes("skin") ||
    text.includes("rash") ||
    text.includes("allergy")
  ) {
    specialties.add("Dermatology");
  }

  if (
    text.includes("ear") ||
    text.includes("nose") ||
    text.includes("throat") ||
    text.includes("sinus")
  ) {
    specialties.add("ENT");
  }

  if (
    text.includes("pregnan") ||
    text.includes("delivery") ||
    text.includes("labour") ||
    text.includes("labour")
  ) {
    specialties.add("OBG");
  }

  if (
    text.includes("sugar") ||
    text.includes("diabetes") ||
    text.includes("thyroid")
  ) {
    specialties.add("Endocrinology");
  }

  if (
    text.includes("kidney") ||
    text.includes("dialysis") ||
    text.includes("creatinine")
  ) {
    specialties.add("Nephrology");
  }

  if (
    text.includes("urine") ||
    text.includes("urinary") ||
    text.includes("prostate")
  ) {
    specialties.add("Urology");
  }

  if (
    text.includes("child") ||
    text.includes("kid") ||
    text.includes("baby") ||
    text.includes("infant")
  ) {
    specialties.add("Pediatrics");
  }

  if (
    text.includes("cancer") ||
    text.includes("tumor") ||
    text.includes("chemotherapy")
  ) {
    specialties.add("Oncology");
  }

  if (
    text.includes("stomach") ||
    text.includes("abdomen") ||
    text.includes("vomit") ||
    text.includes("loose motion") ||
    text.includes("diarrhoea") ||
    text.includes("diarrhea")
  ) {
    specialties.add("Gastroenterology");
  }

  // Always include General Medicine as a safe default
  specialties.add("General Medicine");

  return Array.from(specialties).slice(0, 4);
}

/**
 * Ask Groq to infer which hospital specialties are most appropriate
 * for the given free-text symptoms.
 * Falls back to a fast local heuristic if Groq is unavailable or slow.
 */
export async function inferSpecialtiesFromSymptoms(symptomsText) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  // If Groq is not configured, fall back immediately
  if (!apiKey) {
    return heuristicSpecialties(symptomsText);
  }

  const systemPrompt =
    "You are a triage assistant helping route patients to hospital departments. " +
    "Given a short description of symptoms, infer which medical specialties or departments are most appropriate. " +
    "Use simple names that match common hospital departments, such as: 'Cardiology', 'Pulmonology', 'Neurology', 'Dermatology', 'Pediatrics', 'Oncology', 'ENT', 'Orthopedics', 'General Medicine', 'General Surgery', 'Psychiatry', 'Nephrology', 'Urology', 'OBG', 'Endocrinology', 'Gastroenterology', etc. " +
    "Return ONLY JSON with a key 'specialties' which is an array of 1-4 strings. No explanations.";

  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content:
          "Symptoms: " +
          symptomsText +
          "\n\nReturn JSON like: {\"specialties\":[\"Pulmonology\",\"General Medicine\"]}",
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  };

  const fetchPromise = fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const timeoutMs = 6000;

  try {
    const response = await Promise.race([
      fetchPromise,
      new Promise((_, reject) => {
        setTimeout(() => {
          const err = new Error("Groq specialty inference timed out");
          err.status = 504;
          reject(err);
        }, timeoutMs);
      }),
    ]);

    if (!response.ok) {
      throw new Error(
        `Groq API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "{}";

    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.specialties)) {
        return parsed.specialties.map((s) => String(s)).slice(0, 4);
      }
    } catch {
      // fall through to heuristic
    }
  } catch (err) {
    console.error("inferSpecialtiesFromSymptoms fallback due to error:", err);
  }

  // Fallback if Groq failed or returned invalid data
  return heuristicSpecialties(symptomsText);
}
