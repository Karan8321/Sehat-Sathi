import express from "express";
import {
  getTriageAssessment,
  chatTriageTurn,
} from "../services/groqService.js";

const router = express.Router();

// POST /api/triage
// Body: { symptoms: string, age?: number, sex?: string, duration?: string, additionalNotes?: string }
router.post("/", async (req, res, next) => {
  try {
    const { symptoms, age, sex, duration, additionalNotes } = req.body || {};

    if (!symptoms || typeof symptoms !== "string") {
      return res.status(400).json({
        error: { message: "Field 'symptoms' (string) is required" },
      });
    }

    const triageInput = {
      symptoms,
      age,
      sex,
      duration,
      additionalNotes,
    };

    const result = await getTriageAssessment(triageInput);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/triage/chat
// Body: { messages: { role: "user" | "assistant", content: string }[] }
router.post("/chat", async (req, res, next) => {
  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: { message: "Field 'messages' (non-empty array) is required" },
      });
    }

    const sanitized = messages
      .filter(
        (m) =>
          m &&
          typeof m.role === "string" &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .map((m) => ({
        role: m.role,
        content: m.content.trim(),
      }));

    if (sanitized.length === 0) {
      return res.status(400).json({
        error: { message: "At least one valid message is required" },
      });
    }

    const result = await chatTriageTurn(sanitized);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
