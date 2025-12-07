import express from "express";
import { sendTriageEmail } from "../services/emailService.js";

const router = express.Router();

// POST /api/alert/email
// Body: { to?: string, subject?: string, body: string }
router.post("/email", async (req, res, next) => {
  try {
    const { to, subject, body } = req.body || {};

    if (!body || typeof body !== "string") {
      return res.status(400).json({
        error: { message: "Field 'body' (string) is required" },
      });
    }

    const target =
      to || process.env.HOSPITAL_ALERT_TO || "karanpurushotham363@gmail.com";

    const mailSubject =
      subject || "SehatSathi triage summary and hospital alert";

    const result = await sendTriageEmail({
      to: target,
      subject: mailSubject,
      body,
    });

    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

export default router;
