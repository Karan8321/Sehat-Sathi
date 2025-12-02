import fetch from "node-fetch";

/**
 * Initiate a Vapi voice call.
 * This is a minimal stub that POSTs to a hypothetical Vapi endpoint.
 */
export async function initiateVapiCall({ to, patientId, metadata }) {
  const apiKey = process.env.VAPI_API_KEY;
  const baseUrl = process.env.VAPI_BASE_URL || "https://api.vapi.ai";

  if (!apiKey) {
    const error = new Error("VAPI_API_KEY is not configured");
    error.status = 500;
    throw error;
  }

  const url = `${baseUrl.replace(/\/$/, "")}/v1/calls`;

  const body = {
    to,
    patientId,
    metadata: metadata || {},
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


