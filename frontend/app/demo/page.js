"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const demoScript = [
  {
    at: 0,
    speaker: "assistant",
    text: "Namaste, this is SehatSathi triage assistant. I will ask a few quick questions about your health.",
  },
  {
    at: 3,
    speaker: "assistant",
    text: "Describe your symptoms, please.",
  },
  {
    at: 6,
    speaker: "caller",
    text: "For the last two days I have fever, body pain, and mild difficulty in breathing.",
  },
  {
    at: 10,
    speaker: "assistant",
    text: "When did this start and is the breathing getting worse?",
  },
  {
    at: 13,
    speaker: "caller",
    text: "Fever started two days back, breathing became uncomfortable today evening.",
  },
  {
    at: 18,
    speaker: "assistant",
    text: "On a scale of 1 to 10, how severe is the discomfort?",
  },
  {
    at: 21,
    speaker: "caller",
    text: "Around 7 out of 10.",
  },
  {
    at: 25,
    speaker: "assistant",
    text: "Do you have chest pain or pressure, or pain spreading to your arm or jaw?",
  },
  {
    at: 29,
    speaker: "caller",
    text: "No chest pain, only fast breathing and weakness.",
  },
  {
    at: 34,
    speaker: "assistant",
    text: "Thank you. I am analysing your answers to assign an urgency level and find the best hospital for you.",
  },
];

// Synthetic hospitals used when a real urgency score is available from the assistant
const syntheticHospitals = [
  {
    id: "low",
    minScore: 1,
    maxScore: 2,
    name: "Community Health Clinic",
    distance: "3.2 km",
    icu: 1,
  },
  {
    id: "moderate",
    minScore: 3,
    maxScore: 4,
    name: "City Care Hospital",
    distance: "2.4 km",
    icu: 4,
  },
  {
    id: "high",
    minScore: 5,
    maxScore: 5,
    name: "SehatSathi Emergency Center",
    distance: "1.1 km",
    icu: 8,
  },
];

const demoUrgencyTimeline = [
  { at: 0, level: 1, label: "Screening" },
  { at: 10, level: 2, label: "Mild concern" },
  { at: 20, level: 3, label: "Moderate" },
  { at: 30, level: 4, label: "High" },
  { at: 36, level: 5, label: "Critical attention" },
];

const demoHospitalTimeline = [
  {
    at: 24,
    name: "City Care Hospital",
    distance: "2.1 km",
    icu: 3,
  },
  {
    at: 32,
    name: "SehatSathi Partner Hospital",
    distance: "3.4 km",
    icu: 5,
  },
];

const totalDemoDuration = 42; // seconds

// For the demo we always talk directly to the Express backend running on 4000.
// This avoids accidentally calling the Next.js frontend URL, which returns HTML.
const API_BASE = "http://localhost:4000";

function levelColor(level) {
  if (level >= 5) return "bg-destructive shadow-destructive/50";
  if (level === 4) return "bg-primary shadow-primary/50";
  if (level === 3) return "bg-primary/70 shadow-primary/40";
  if (level === 2) return "bg-primary/40 shadow-primary/20";
  return "bg-muted shadow-muted/50";
}

// Simple heuristic: nudge numeric urgency up/down based on symptom wording
function adjustUrgencyScore(rawScore, latestUserText) {
  const base = Number(rawScore) || 3;
  if (!latestUserText || typeof latestUserText !== "string") return base;

  const text = latestUserText.toLowerCase();

  // Phrases that usually indicate milder problems
  const mildHints = [
    "mild",
    "small cough",
    "small cold",
    "slight cough",
    "slight cold",
    "normal cold",
    "little cough",
    "runny nose",
    "sore throat only",
    "dizzy",
    "dizziness",
    "lightheaded",
    "light headed",
    "giddy",
    "feeling giddy",
    "spinning sensation",
    "vertigo",
  ];

  // Phrases that strongly suggest emergency
  const severeHints = [
    "severe chest pain",
    "crushing chest pain",
    "can't breathe",
    "cannot breathe",
    "difficulty breathing",
    "shortness of breath",
    "fainting",
    "lost consciousness",
    "unconscious",
    "stroke",
    "weakness on one side",
  ];

  let score = base;

  if (severeHints.some((h) => text.includes(h))) {
    score = Math.min(5, Math.max(score, base + 1));
  } else if (mildHints.some((h) => text.includes(h))) {
    score = Math.max(1, base - 2);
  }

  return score;
}

export default function DemoCallPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [urgency, setUrgency] = useState(demoUrgencyTimeline[0]);
  const [activeHospital, setActiveHospital] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  // Groq chat state for "Try your own symptoms"
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatResult, setChatResult] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [callInfo, setCallInfo] = useState(null);
  const [callError, setCallError] = useState(null);
  // Local browser voice demo (no Vapi)
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [alertSending, setAlertSending] = useState(false);
  const [alertError, setAlertError] = useState("");
  const [matchedHospital, setMatchedHospital] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState("");
  const [matchedHospitals, setMatchedHospitals] = useState([]);
  const [userDistrict, setUserDistrict] = useState("");
  const [userTaluk, setUserTaluk] = useState("");
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [autoListen, setAutoListen] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    setElapsed(0);
    setTranscript([]);
    setUrgency(demoUrgencyTimeline[0]);
    setActiveHospital(null);
    setAlertSent(false);

    const startedAt = Date.now();

    const interval = setInterval(() => {
      const secs = (Date.now() - startedAt) / 1000;
      if (secs >= totalDemoDuration) {
        setElapsed(totalDemoDuration);
        setAlertSent(true);
        clearInterval(interval);
        return;
      }
      setElapsed(secs);
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Update transcript & timeline whenever elapsed changes
  useEffect(() => {
    if (!isRunning) return;

    // Transcript
    const visibleLines = demoScript.filter((line) => line.at <= elapsed + 0.1);
    setTranscript(visibleLines);

    // Urgency
    const currentUrgency =
      demoUrgencyTimeline
        .filter((u) => u.at <= elapsed + 0.1)
        .sort((a, b) => b.at - a.at)[0] ?? demoUrgencyTimeline[0];
    setUrgency(currentUrgency);

    // Hospital match
    const currentHospital =
      demoHospitalTimeline
        .filter((h) => h.at <= elapsed + 0.1)
        .sort((a, b) => b.at - a.at)[0] ?? null;
    setActiveHospital(currentHospital);

    // Alert sent near the end
    if (elapsed >= totalDemoDuration - 3) {
      setAlertSent(true);
    }
  }, [elapsed, isRunning]);

  // Detect browser speech APIs
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasTTS = typeof window.speechSynthesis !== "undefined";
    setVoiceSupported(Boolean(SpeechRecognition) && hasTTS);
  }, []);

  const speakText = (text) => {
    if (typeof window === "undefined") return;
    if (!text || !window.speechSynthesis) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();

      const chooseVoice = () => {
        const voices = synth.getVoices?.() || [];
        if (!voices.length) return null;

        // Prefer Indian English if available
        const exactLang = voices.find((v) =>
          String(v.lang || "").toLowerCase().startsWith("en-in")
        );
        if (exactLang) return exactLang;

        const nameMatch = voices.find((v) => {
          const name = String(v.name || "").toLowerCase();
          return name.includes("india") || name.includes("indian");
        });
        if (nameMatch) return nameMatch;

        // Fallback to any English voice
        const anyEnglish = voices.find((v) =>
          String(v.lang || "").toLowerCase().startsWith("en")
        );
        return anyEnglish || voices[0] || null;
      };

      const utterance = new SpeechSynthesisUtterance(text);
      const selectedVoice = chooseVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // After assistant finishes speaking, optionally start listening
        // again so the user does not need to click the microphone each time.
        if (autoListen && !isListening) {
          handleVoiceCapture();
        }
      };
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
    } catch (e) {
      // fail silently, keep UI working even if TTS fails
      setIsSpeaking(false);
    }
  };

  const sendChatMessage = async (content) => {
    if (!content?.trim()) return;
    if (chatLoading) return;
    const userMessage = { role: "user", content: content.trim() };
    const nextMessages = [...chatMessages, userMessage];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/triage/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(
          data?.error?.message || "Groq chat failed. Check backend logs."
        );
      }
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      setChatResult({
        urgencyLevel: data.urgencyLevel,
        numericUrgency: data.numericUrgency,
        advice: data.advice,
      });
      speakText(data.reply);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not reach the Groq backend right now. Please check that the Node server is running on port 4000.",
        },
      ]);
      setChatResult({
        urgencyLevel: "non-urgent",
        numericUrgency: 3,
        advice:
          err.message ||
          "Could not reach Groq backend. Check that the Node server is running on port 4000.",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleVoiceCapture = () => {
    setVoiceError("");
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setVoiceError("Browser speech recognition is not available.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setVoiceText("");

      let finalTranscript = "";

      recognition.onresult = (event) => {
        let aggregated = "";
        for (let i = 0; i < event.results.length; i++) {
          aggregated += event.results[i][0].transcript + " ";
        }
        finalTranscript = aggregated.trim();
        setVoiceText(finalTranscript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setVoiceError(event.error || "Speech recognition error.");
      };

      recognition.onend = () => {
        setIsListening(false);
        if (finalTranscript && finalTranscript.trim()) {
          sendChatMessage(finalTranscript);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setVoiceError("Unable to start microphone recognition.");
    }
  };

  const handleUseCurrentLocation = async () => {
    setLocationError("");

    if (typeof window === "undefined") return;
    if (!navigator.geolocation) {
      setLocationError("Current location is not supported in this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          setUserLat(latitude);
          setUserLng(longitude);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!res.ok) {
            throw new Error("Unable to look up address from location.");
          }

          const data = await res.json();
          const address = data?.address || {};

          const district =
            address.district ||
            address.county ||
            address.state_district ||
            "";
          const taluk =
            address.suburb ||
            address.town ||
            address.city ||
            address.village ||
            address.state_district ||
            "";

          if (!district && !taluk) {
            throw new Error("Could not detect district/taluk from this location.");
          }

          if (district) setUserDistrict(district);
          if (taluk) setUserTaluk(taluk);
        } catch (err) {
          setLocationError(
            err?.message ||
              "Unable to fetch address for your current location. Please type it manually."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        if (error?.code === 1) {
          setLocationError("Permission to access location was denied.");
        } else {
          setLocationError(
            error?.message ||
              "Could not read your current location. Please try again or type it manually."
          );
        }
      }
    );
  };

  const handleStart = () => {
    setIsRunning(false);
    // Short delay to reset UI cleanly
    setTimeout(() => {
      setIsRunning(true);
    }, 50);
  };

  const ringing = isRunning && elapsed < 4;

  // Use real chatResult urgency when available; otherwise fall back to demo timeline
  const effectiveUrgencyScore = chatResult?.numericUrgency || urgency.level;
  const effectiveUrgencyLabel = chatResult?.urgencyLevel || urgency.label;
  const effectiveHospital = matchedHospital || activeHospital;
  const currentUrgencyScore = chatResult?.numericUrgency || effectiveUrgencyScore;
  const alertActive = currentUrgencyScore >= 3;

  useEffect(() => {
    if (!matchedHospitals.length) return;
    if (typeof window === "undefined") return;

    const mapContainer = document.getElementById("hospital-map");
    if (!mapContainer) return;

    const ensureLeafletCss = () => {
      const id = "leaflet-css";
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    };

    const initMap = () => {
      const L = window.L;
      if (!L || !mapContainer) return;

      if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
        mapContainer.innerHTML = "";
      }

      const points = matchedHospitals
        .map((h) => [Number(h.Latitude), Number(h.Longitude), h])
        .filter(([lat, lng]) => !Number.isNaN(lat) && !Number.isNaN(lng));

      if (!points.length) return;

      const map = L.map(mapContainer).setView([points[0][0], points[0][1]], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const bounds = [];

      points.forEach(([lat, lng, h]) => {
        const marker = L.marker([lat, lng]).addTo(map);
        const icu = h.ICU_Beds || "?";
        const oxygen = h.Oxygen_Beds || "?";
        const available = h.Available_Beds || "?";
        const name = h.Hospital_Name || h.name || "Hospital";
        const mapsUrl =
          h.Google_Maps_Link ||
          `https://www.google.com/maps?q=${encodeURIComponent(
            `${lat},${lng}`
          )}`;

        const popupHtml = `
<div style="font-size:12px; line-height:1.4;">
  <strong>${name}</strong><br/>
  ICU: ${icu} · Oxygen: ${oxygen}<br/>
  Available beds: ${available}<br/>
  <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
</div>`;

        marker.bindPopup(popupHtml);
        marker.on("click", () => {
          window.open(mapsUrl, "_blank", "noopener,noreferrer");
        });
        bounds.push([lat, lng]);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    };

    ensureLeafletCss();

    if (window.L) {
      initMap();
      return;
    }

    const existingScript = document.getElementById("leaflet-js");
    if (existingScript) {
      existingScript.addEventListener("load", initMap, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = initMap;
    document.body.appendChild(script);
  }, [matchedHospitals]);

  // Whenever we have enough symptom text or location changes, ask backend to match hospitals
  useEffect(() => {
    if (!chatMessages.length) return;

    const latestUser = [...chatMessages]
      .reverse()
      .find((m) => m.role === "user")?.content;

    if (!latestUser) return;

    setMatchError("");
    setMatchLoading(true);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/hospitals/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symptomsText: latestUser,
            urgency: chatResult?.numericUrgency,
            // Do not set maxResults here so the backend can return all
            // hospitals for the selected district/taluk.
            district: userDistrict || undefined,
            taluk: userTaluk || undefined,
            userLat: userLat ?? undefined,
            userLng: userLng ?? undefined,
          }),
        });

        const contentType = res.headers.get("content-type") || "";
        const rawText = await res.text();
        let data = null;

        if (contentType.includes("application/json")) {
          try {
            data = JSON.parse(rawText || "{}");
          } catch {
            throw new Error("Hospital match response was not valid JSON.");
          }
        } else if (rawText.startsWith("<!DOCTYPE")) {
          throw new Error(
            "Hospital match endpoint returned an HTML page instead of JSON. Check that API_BASE points to the Express backend."
          );
        } else {
          throw new Error(
            "Unexpected response from hospital match endpoint."
          );
        }

        if (!res.ok || data?.error) {
          throw new Error(
            data?.error?.message ||
              "Unable to match hospitals. Check backend logs."
          );
        }

        const list = Array.isArray(data.hospitals) ? data.hospitals : [];
        const best = list[0] || null;
        setMatchedHospital(best || null);
        setMatchedHospitals(list);
      } catch (err) {
        setMatchedHospital(null);
        setMatchedHospitals([]);
        setMatchError(err.message || "Unable to match hospitals.");
      } finally {
        setMatchLoading(false);
      }
    })();
  }, [chatResult, chatMessages, userDistrict, userTaluk]);

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10 lg:py-10">
      <main className="mx-auto flex max-w-5xl flex-col gap-7">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              SehatSathi · Assistant
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Voice Triage Assistant
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Talk or type to describe how you are feeling. The assistant will
              ask a few questions, estimate urgency, and suggest a hospital
              based on your symptoms.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={handleVoiceCapture}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/30 to-primary/0 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
              <span className="relative flex items-center gap-2">
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground/40" />
                  <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/80">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                </span>
                <span className="text-sm uppercase tracking-[0.18em]">
                  Start voice assistant
                </span>
              </span>
            </button>
            <span className="text-[0.65rem] text-muted-foreground">
              Uses your microphone and text input · Assistant below shows all
              messages
            </span>
          </div>
        </header>

        {/* Layout */}
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)]">
          {/* Main assistant interaction: text + voice */}
          <div className="flex flex-col gap-4">
            <Card className="border-border bg-card/95 shadow-[0_18px_60px_rgba(0,0,0,0.6)] transition hover:border-primary/60 hover:shadow-[0_22px_80px_rgba(0,0,0,0.8)]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm text-card-foreground">
                    Describe how you are feeling
                  </CardTitle>
                  {chatResult?.numericUrgency && (
                    <span className="text-[0.7rem] text-muted-foreground">
                      Urgency: {chatResult.numericUrgency}/5
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="space-y-2">
                  <div className="mt-1 flex max-h-52 flex-col gap-1.5 overflow-y-auto border border-border bg-background p-3 shadow-inner">
                    {chatMessages.length === 0 && (
                      <p className="text-[0.7rem] text-muted-foreground">
                        Start by typing or speaking your symptoms. The assistant
                        will ask follow-up questions and estimate urgency.
                      </p>
                    )}
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={`${idx}-${msg.role}`}
                        className={`flex ${
                          msg.role === "assistant"
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 text-[0.7rem] leading-relaxed shadow-sm ${
                            msg.role === "assistant"
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-70">
                            {msg.role === "assistant" ? "Assistant" : "You"}
                          </p>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <p className="text-[0.7rem] text-muted-foreground">
                        Processing…
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <form
                    className="flex w-full"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await sendChatMessage(chatInput);
                    }}
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-[0.85rem] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      placeholder="Describe what you are feeling, or answer the assistant…"
                    />
                  </form>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || chatLoading}
                      onClick={async () => {
                        await sendChatMessage(chatInput);
                      }}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-[0.8rem] font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {chatLoading ? "Sending…" : "Send"}
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={!voiceSupported || chatLoading || isListening}
                        onClick={handleVoiceCapture}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-muted px-3 py-2 text-[0.75rem] font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/70">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 fill-current"
                            aria-hidden="true"
                          >
                            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V20h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.07A7 7 0 0 1 5 11a1 1 0 1 1 2 0 5 5 0 0 0 10 0z" />
                          </svg>
                        </span>
                        <span>{isListening ? "Listening…" : "Use microphone"}</span>
                      </button>
                      <label className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-border bg-background"
                          checked={autoListen}
                          onChange={(e) => setAutoListen(e.target.checked)}
                        />
                        <span>Auto re-listen</span>
                      </label>
                      {isSpeaking && (
                        <span className="text-[0.7rem] text-muted-foreground">
                          Speaking reply…
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {voiceText && (
                  <div className="rounded border border-border bg-background/60 p-2 text-[0.75rem] text-muted-foreground">
                    <span className="font-semibold">You said:</span> {voiceText}
                  </div>
                )}
                {voiceError && (
                  <p className="text-[0.7rem] text-destructive">{voiceError}</p>
                )}

                {chatResult && (
                  <div className="mt-1 space-y-1 rounded border border-border bg-background/60 p-3">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Urgency: {chatResult.urgencyLevel} · Score {" "}
                      {chatResult.numericUrgency}/5
                    </p>
                    <p className="text-[0.8rem] text-muted-foreground">
                      {chatResult.advice}
                    </p>
                  </div>
                )}

                {!voiceSupported && (
                  <p className="text-[0.7rem] text-muted-foreground">
                    Microphone features may not be available in this browser.
                    Typing works in all modern browsers.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/90">
              <CardHeader className="border-b border-border pb-2">
                <CardTitle className="text-sm text-card-foreground">
                  Nearby hospitals map
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-xs space-y-2">
                {!matchedHospitals.length && (
                  <p className="text-[0.75rem] text-muted-foreground">
                    Once a hospital match is available, a map with nearby
                    facilities will appear here.
                  </p>
                )}
                <div
                  id="hospital-map"
                  className="mt-1 h-64 w-full rounded border border-border bg-background/80"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right side: urgency + hospital match + alert */}
          <div className="flex flex-col gap-4">
            {/* Location card */}
            <Card className="border-border bg-card/95 shadow-[0_16px_50px_rgba(0,0,0,0.55)] transition hover:border-primary/60 hover:shadow-[0_20px_70px_rgba(0,0,0,0.8)]">
              <CardHeader className="border-b border-border pb-2 flex items-center justify-between gap-3">
                <CardTitle className="text-sm text-card-foreground">
                  Your location (optional)
                </CardTitle>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading}
                  className="inline-flex items-center justify-center rounded border border-border bg-background px-3 py-1.5 text-[0.7rem] font-semibold text-muted-foreground hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationLoading ? "Detecting…" : "Use current location"}
                </button>
              </CardHeader>
              <CardContent className="grid gap-2 pt-3 text-xs sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[0.7rem] font-medium text-muted-foreground">
                    District
                  </label>
                  <input
                    type="text"
                    value={userDistrict}
                    onChange={(e) => setUserDistrict(e.target.value)}
                    placeholder="e.g. Mandya, Kolar"
                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-[0.8rem] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[0.7rem] font-medium text-muted-foreground">
                    Taluk
                  </label>
                  <input
                    type="text"
                    value={userTaluk}
                    onChange={(e) => setUserTaluk(e.target.value)}
                    placeholder="e.g. Maddur, Malur"
                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-[0.8rem] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <p className="col-span-full text-[0.7rem] text-muted-foreground">
                  This helps SehatSathi pick hospitals in your district and taluk
                  with better ICU and oxygen availability. You can type it
                  manually or let the browser fill it from your current
                  location.
                </p>
                {locationError && (
                  <p className="col-span-full text-[0.7rem] text-destructive">
                    {locationError}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Urgency card */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm text-card-foreground">
                    AI Triage Urgency
                  </CardTitle>
                  <Badge className="bg-muted text-[0.65rem] text-muted-foreground">
                    Groq · Demo logic
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-3 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Current score
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-primary">
                        {currentUrgencyScore}
                      </span>
                      <span className="text-xs text-muted-foreground">/ 5</span>
                    </div>
                    <p className="text-[0.8rem] text-muted-foreground">
                      {chatResult?.urgencyLevel || effectiveUrgencyLabel}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex justify-between text-[0.65rem] text-muted-foreground">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <div className="flex h-2.5 items-center gap-1 bg-muted p-0.5">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1.5 flex-1 shadow-[0_0_20px_var(--tw-shadow-color)] transition-all ${lvl <= (chatResult?.numericUrgency || effectiveUrgencyScore)
                            ? levelColor(lvl)
                            : "bg-muted-foreground/20"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground">
                      Higher score means closer to emergency priority.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hospital match */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm text-card-foreground">
                    Smart Hospital Match
                  </CardTitle>
                  <Badge
                    variant={
                      effectiveHospital
                        ? "success"
                        : matchError
                        ? "destructive"
                        : matchLoading
                        ? "default"
                        : "outline"
                    }
                    className="text-[0.65rem]"
                  >
                    {effectiveHospital
                      ? "Match found"
                      : matchError
                      ? "No match"
                      : matchLoading
                      ? "Searching…"
                      : "Waiting for info"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-3 text-xs">
                {effectiveHospital ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {effectiveHospital.Hospital_Name || effectiveHospital.name}
                        </p>
                        <p className="text-[0.75rem] text-muted-foreground">
                          {effectiveHospital.District || "Unknown district"}
                          {effectiveHospital.Taluk
                            ? ` · ${effectiveHospital.Taluk}`
                            : ""}
                          {" · "}
                          ICU beds: {effectiveHospital.ICU_Beds || "0"} · Oxygen
                          beds: {effectiveHospital.Oxygen_Beds || "0"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-primary/10 px-2 py-0.5 text-[0.65rem] text-primary ring-1 ring-primary/40">
                          Recommended
                        </span>
                        <span className="text-[0.65rem] text-muted-foreground">
                          Based on distance &amp; capacity
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 grid grid-cols-3 gap-2 text-[0.7rem] text-muted-foreground">
                      <div className="space-y-0.5">
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                          Oxygen
                        </p>
                        <p>
                          {effectiveHospital.Oxygen_Beds
                            ? `${effectiveHospital.Oxygen_Beds} beds`
                            : "Check with hospital"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                          ICU beds
                        </p>
                        <p>
                          {effectiveHospital.ICU_Beds
                            ? `${effectiveHospital.ICU_Beds} beds`
                            : "Check with hospital"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                          Total beds
                        </p>
                        <p>
                          {effectiveHospital.Total_Beds
                            ? `${effectiveHospital.Total_Beds} beds`
                            : "Check with hospital"}
                        </p>
                      </div>
                    </div>
                  </>
                ) : matchLoading ? (
                  <p className="text-[0.75rem] text-muted-foreground">
                    Analysing your symptoms and hospital capacity to choose the
                    best option a0nearby a0 a0 a0
                  </p>
                ) : matchError ? (
                  <p className="text-[0.75rem] text-destructive">
                    {matchError || "Unable to match hospitals right now."}
                  </p>
                ) : (
                  <p className="text-[0.75rem] text-muted-foreground">
                    Once the assistant has enough information, SehatSathi will
                    automatically choose the best nearby hospital based on ICU
                    beds, oxygen, and distance.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Alert notification */}
            <Card className="border-destructive/30 bg-destructive/10">
              <CardHeader className="flex flex-row items-center justify-between gap-3 border-none pb-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span
                      className={`absolute inline-flex h-full w-full bg-destructive/40 ${alertActive ? "animate-ping" : "opacity-20"}`}
                    />
                    <span className="relative inline-flex h-6 w-6 items-center justify-center bg-destructive text-destructive-foreground">
                      !
                    </span>
                  </span>
                  <CardTitle className="text-sm text-destructive">
                    Alert to Hospital Command Center
                  </CardTitle>
                </div>
                <Badge
                  variant="success"
                  className="text-[0.65rem] bg-destructive text-destructive-foreground"
                >
                  {alertActive ? "Active" : "Pending"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 pt-1 text-[0.75rem] text-destructive">
                <p>
                  {alertActive
                    ? `AI triage marked this case as urgency score ${currentUrgencyScore}/5. Command center should review and prepare a bed.`
                    : "Once urgency is moderate or higher, SehatSathi will raise an alert to the command center."}
                </p>
                <ul className="grid gap-1 text-[0.7rem] text-destructive/90 sm:grid-cols-2">
                  <li>• ER triage nurse notified</li>
                  <li>• ICU capacity snapshot attached</li>
                  <li>• Suggested bed type: HDU / oxygen support</li>
                  <li>• Live ambulance ETA streaming</li>
                </ul>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.7rem]">
                    <button
                      type="button"
                      disabled={alertSending || !chatMessages.length}
                      onClick={async () => {
                        if (!chatMessages.length) return;
                        setAlertError("");
                        setAlertSending(true);
                        try {
                          const latestUser =
                            [...chatMessages]
                              .reverse()
                              .find((m) => m.role === "user")?.content || "";

                          const summaryLines = [];
                          summaryLines.push("SehatSathi triage summary\n");
                          summaryLines.push(
                            `Primary symptoms (latest patient message): ${latestUser}`
                          );
                          summaryLines.push(
                            `Estimated urgency score: ${
                              chatResult?.numericUrgency || effectiveUrgencyScore
                            } / 5`
                          );
                          summaryLines.push(
                            `Urgency classification: ${
                              chatResult?.urgencyLevel || effectiveUrgencyLabel
                            }`
                          );
                          summaryLines.push("");
                          if (effectiveHospital) {
                            summaryLines.push(
                              `Suggested facility: ${effectiveHospital.name}`
                            );
                            summaryLines.push(
                              `Approx. distance: ${effectiveHospital.distance}`
                            );
                            summaryLines.push(
                              `Approx. ICU beds free: ${effectiveHospital.icu}`
                            );
                          }
                          summaryLines.push("");
                          summaryLines.push("Conversation transcript:");
                          chatMessages.forEach((m) => {
                            summaryLines.push(
                              `${m.role === "assistant" ? "Assistant" : "Patient"}: ${
                                m.content
                              }`
                            );
                          });

                          const body = summaryLines.join("\n");

                          const res = await fetch(`${API_BASE}/api/alert/email`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ body }),
                          });
                          const data = await res.json();
                          if (!res.ok || data.error) {
                            throw new Error(
                              data?.error?.message ||
                                "Unable to send alert email. Check backend logs."
                            );
                          }
                          setAlertSent(true);
                        } catch (err) {
                          setAlertError(
                            err.message || "Unable to send alert email."
                          );
                        } finally {
                          setAlertSending(false);
                        }
                      }}
                      className="inline-flex items-center justify-center rounded border border-destructive bg-transparent px-3 py-1.5 text-[0.7rem] font-semibold text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {alertSending ? "Sending…" : "Send summary by email"}
                    </button>
                    {alertError && (
                      <span className="text-[0.7rem] text-destructive">
                        {alertError}
                      </span>
                    )}
                  </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}


