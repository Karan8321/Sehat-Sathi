import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import triageRouter from "./routes/triage.js";
import hospitalsRouter from "./routes/hospitals.js";
import callRouter from "./routes/call.js";
import { triageAssistantConfig, analyzeTriageWithGroq } from "./vapiConfig.js";

// Load environment variables from .env if present
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/triage", triageRouter);
app.use("/api/hospitals", hospitalsRouter);
app.use("/api/call", callRouter);

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


