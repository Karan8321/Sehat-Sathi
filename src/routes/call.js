import express from "express";
import { initiateVapiCall } from "../services/vapiService.js";

const router = express.Router();

// POST /api/call
// Body: { to: string, patientId?: string, metadata?: object }
router.post("/", async (req, res, next) => {
  try {
    const { to, patientId, metadata } = req.body || {};

    if (!to || typeof to !== "string") {
      return res.status(400).json({
        error: { message: "Field 'to' (string) is required" },
      });
    }

    const callResult = await initiateVapiCall({
      to,
      patientId,
      metadata,
    });

    res.json(callResult);
  } catch (err) {
    next(err);
  }
});

export default router;


