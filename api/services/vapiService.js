export async function initiateVapiCall({ to, patientId, metadata }) {
  const apiKey = process.env.VAPI_API_KEY;
  const baseUrl = process.env.VAPI_BASE_URL || "https://api.vapi.ai";
  const assistantId = process.env.VAPI_ASSISTANT_ID;

  if (!apiKey) {
    const error = new Error("VAPI_API_KEY is not configured");
    error.status = 500;
    throw error;
  }

  if (!assistantId) {
    const error = new Error("VAPI_ASSISTANT_ID is not configured");
    error.status = 500;
    throw error;
  }

  const url = `${baseUrl.replace(/\/$/, "")}/call/phone`;

  const body = {
    phoneNumber: to,
    assistantId,
    // optionally pass patientId inside metadata
    metadata: { ...(metadata || {}), patientId },
  };

  const response = await fetch(url, {
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
      `Vapi API error: ${response.status} ${response.statusText}`
    );
    error.status = 502;
    error.details = text;
    throw error;
  }

  const data = await response.json();

  return {
    success: true,
    callId: data.id || data.callId,
    providerResponse: data,
  };
}