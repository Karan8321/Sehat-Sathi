import express from "express";
import { findNearbyHospitals } from "../services/hospitalService.js";

const router = express.Router();

// GET /api/hospitals
// Query params: lat, lng, radiusKm?
router.get("/", async (req, res, next) => {
  try {
    const { lat, lng, radiusKm } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: { message: "Query params 'lat' and 'lng' are required" },
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);
    const radius = radiusKm ? Number(radiusKm) : 10;

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({
        error: { message: "'lat' and 'lng' must be valid numbers" },
      });
    }

    const hospitals = await findNearbyHospitals({
      latitude,
      longitude,
      radiusKm: radius,
    });

    res.json({ hospitals });
  } catch (err) {
    next(err);
  }
});

export default router;


