import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import triageRouter from "./routes/triage.js";
import hospitalsRouter from "./routes/hospitals.js";
import hospitalMatchRouter from "./routes/hospitalMatch.js";
import callRouter from "./routes/call.js";
import alertRouter from "./routes/alert.js";
import { triageAssistantConfig, analyzeTriageWithGroq } from "./vapiConfig.js";

// Load environment variables from .env if present
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Medical Triage Voice AI Backend", 
    status: "running",
    endpoints: {
      health: "/health",
      triage: "/api/triage",
      hospitals: "/api/hospitals",
      call: "/api/call",
      alert: "/api/alert",
      vapi: "/api/vapi/assistant"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/triage", triageRouter);
app.use("/api/hospitals", hospitalsRouter, hospitalMatchRouter);
app.use("/api/call", callRouter);
app.use("/api/alert", alertRouter);

// Expose Vapi voice assistant config
app.get("/api/vapi/assistant", (req, res) => {
  res.json(triageAssistantConfig);
});

// Webhook-style endpoint for Vapi to send completed triage answers
// and receive a numeric urgency level (1–5) from Groq.
app.post("/api/vapi/triage-analyze", async (req, res, next) => {
  try {
    const { transcript, answers, patientId, language } = req.body || {};

    if (!transcript && !answers) {
      return res.status(400).json({
        error: {
          message:
            "Request body must include at least 'transcript' or 'answers'.",
        },
      });
    }

    const result = await analyzeTriageWithGroq({
      transcript,
      answers,
      patientId,
      language,
    });

    res.json({
      urgency: result.urgency, // 1–5
      reasoning: result.reasoning,
    });
  } catch (err) {
    next(err);
  }
});

// Fallback 404 handler so unknown routes return JSON, not HTML
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      details: `${req.method} ${req.originalUrl}`,
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal server error",
      details: err.details || null,
    },
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Medical triage voice AI backend running on port ${PORT}`);
});


