import nodemailer from "nodemailer";

let transporter;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || user;

  if (!host || !user || !pass) {
    const error = new Error(
      "SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, SMTP_PASS in .env"
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
