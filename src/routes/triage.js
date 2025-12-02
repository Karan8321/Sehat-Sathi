import express from "express";
import { getTriageAssessment } from "../services/groqService.js";

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

export default router;


