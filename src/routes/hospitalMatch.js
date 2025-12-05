import express from "express";
import { inferSpecialtiesFromSymptoms } from "../services/hospitalSpecialtyService.js";
import { matchHospitals } from "../services/hospitalMatchService.js";
import { inferFromSymptomsCsv } from "../services/symptomTriageService.js";

const router = express.Router();

// POST /api/hospitals/match
// Body: { symptomsText: string, urgency?: number, maxResults?: number }
router.post("/match", async (req, res, next) => {
  try {
    const {
      symptomsText,
      urgency,
      maxResults,
      district,
      taluk,
      userLat,
      userLng,
    } = req.body || {};

    if (!symptomsText || typeof symptomsText !== "string") {
      return res.status(400).json({
        error: { message: "Field 'symptomsText' (string) is required" },
      });
    }

    const csvInfo = inferFromSymptomsCsv(symptomsText, district);
    const aiSpecialties = await inferSpecialtiesFromSymptoms(symptomsText);

    const combinedSpecialties = Array.from(
      new Set([...(csvInfo.specialties || []), ...(aiSpecialties || [])])
    );

    const hospitals = matchHospitals({
      specialties: combinedSpecialties,
      urgency: typeof urgency === "number" ? urgency : undefined,
      district,
      taluk,
      userLat,
      userLng,
    });

    const limited = maxResults
      ? hospitals.slice(0, Number(maxResults) || 5)
      : hospitals;

    res.json({
      specialties: combinedSpecialties,
      triageSteps: csvInfo.triageSteps || null,
      hospitals: limited,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
