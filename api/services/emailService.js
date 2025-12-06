import nodemailer from "nodemailer";

let transporter;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || user;

  // Check if SMTP is configured (not empty and not placeholder values)
  const hasPlaceholders = user === "your_email@gmail.com" || pass === "your_app_password_here" || pass === "";

  if (!host || !user || !pass || hasPlaceholders) {
    const error = new Error(
      "SMTP configuration is missing or incomplete. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env file. " +
      "For Gmail: Use an App Password (get it from https://myaccount.google.com/apppasswords). " +
      "If you don't need email alerts, you can leave these values but the email alert feature will not work."
    );
    error.status = 500;
    throw error;
  }

  return { host, port, user, pass, from };
}

function getTransporter() {
  if (!transporter) {
    const cfg = getSmtpConfig();
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465,
      auth: {
        user: cfg.user,
        pass: cfg.pass,
      },
    });
  }
  return transporter;
}

/**
 * Send a triage summary email to a hospital / command center.
 */
export async function sendTriageEmail({ to, subject, body }) {
  const cfg = getSmtpConfig();

  const mailOptions = {
    from: cfg.from,
    to,
    subject,
    text: body,
  };

  const tx = await getTransporter().sendMail(mailOptions);
  return {
    messageId: tx.messageId,
    accepted: tx.accepted,
    rejected: tx.rejected,
  };
}
