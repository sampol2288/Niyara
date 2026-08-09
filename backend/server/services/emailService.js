import nodemailer from "nodemailer";

/**
 * Create a Nodemailer transporter using SMTP environment variables.
 * Credentials must be provided via environment variables — no hardcoded fallbacks.
 */
const createTransporter = (port = 587) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : undefined;

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS environment variables are required for email delivery.");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
};

const getSenderAddress = () => {
  const user = process.env.SMTP_USER;
  return process.env.EMAIL_FROM || `"NIYARA Archival Concierge" <${user}>`;
};

/**
 * Send OTP verification email to recipient.
 * NOTE: The OTP code itself is NOT returned to the caller — it is stored server-side only.
 */
export const sendOTPEmail = async (toEmail, otpCode, purpose = "Verification", name = "Member") => {
  const senderAddress = getSenderAddress();

  console.log(`[OTP Email] Dispatching to: ${toEmail} | Purpose: ${purpose}`);

  const mailOptions = {
    from: senderAddress,
    to: toEmail,
    subject: `[NIYARA] Your ${purpose} Verification Code`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 2.5rem; border-radius: 12px; max-width: 520px; margin: 0 auto; border: 1px solid #c5a072;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 style="font-family: Georgia, serif; letter-spacing: 0.15em; color: #c5a072; margin: 0; font-size: 2.2rem;">NIYARA</h1>
          <p style="font-size: 0.75rem; letter-spacing: 0.2em; color: #a1a1aa; text-transform: uppercase; margin-top: 0.25rem;">Archival Fashion Concierge</p>
        </div>

        <p style="font-size: 1rem; color: #e4e4e7;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 0.95rem; color: #a1a1aa; line-height: 1.6;">
          Your 6-digit security verification code for <strong>${purpose.toLowerCase()}</strong> is provided below:
        </p>

        <div style="background: linear-gradient(135deg, rgba(197, 160, 114, 0.2) 0%, rgba(197, 160, 114, 0.05) 100%); border: 1px dashed #c5a072; border-radius: 10px; padding: 1.5rem; text-align: center; margin: 1.75rem 0;">
          <span style="font-size: 2.5rem; font-weight: 800; letter-spacing: 0.35em; color: #c5a072; display: inline-block;">${otpCode}</span>
        </div>

        <p style="font-size: 0.825rem; color: #a1a1aa; text-align: center; line-height: 1.5;">
          This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>

        <div style="border-top: 1px solid #27272a; margin-top: 2rem; padding-top: 1.25rem; text-align: center; font-size: 0.75rem; color: #71717a;">
          &copy; 2026 NIYARA Archival Fashion Portal. All rights reserved.
        </div>
      </div>
    `
  };

  // Attempt 1: Port 587 STARTTLS
  try {
    const transporter = createTransporter(587);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Dispatched via port 587 | ID: ${info.messageId}`);
    return { success: true, deliveredVia: "Gmail SMTP Port 587", messageId: info.messageId };
  } catch (err587) {
    console.warn(`[Email] Port 587 failed: ${err587.message}. Trying port 465...`);

    // Attempt 2: Port 465 SSL
    try {
      const sslTransporter = createTransporter(465);
      const info = await sslTransporter.sendMail(mailOptions);
      console.log(`[Email] Dispatched via port 465 | ID: ${info.messageId}`);
      return { success: true, deliveredVia: "Gmail SMTP Port 465", messageId: info.messageId };
    } catch (err465) {
      console.error(`[Email] Both ports failed. Last error: ${err465.message}`);
      return { success: false, error: err465.message };
    }
  }
};

/**
 * Send a custom email message to a recipient.
 */
export const sendCustomEmail = async (toEmail, name = "Member", subject = "Message from NIYARA", bodyText = "") => {
  const senderAddress = getSenderAddress();

  const mailOptions = {
    from: senderAddress,
    to: toEmail,
    subject,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 2.5rem; border-radius: 12px; max-width: 540px; margin: 0 auto; border: 1px solid #c5a072;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 style="font-family: Georgia, serif; letter-spacing: 0.15em; color: #c5a072; margin: 0; font-size: 2.2rem;">NIYARA</h1>
          <p style="font-size: 0.75rem; letter-spacing: 0.2em; color: #a1a1aa; text-transform: uppercase; margin-top: 0.25rem;">Archival Fashion Concierge</p>
        </div>
        <p style="font-size: 1rem; color: #e4e4e7;">Dear <strong>${name}</strong>,</p>
        <div style="font-size: 0.95rem; color: #d4d4d8; line-height: 1.7; white-space: pre-wrap; margin: 1.5rem 0;">${bodyText}</div>
        <div style="border-top: 1px solid #27272a; margin-top: 2rem; padding-top: 1.25rem; text-align: center; font-size: 0.75rem; color: #71717a;">
          &copy; 2026 NIYARA Archival Fashion Portal. All rights reserved.
        </div>
      </div>
    `
  };

  try {
    const transporter = createTransporter(587);
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId, deliveredVia: "Gmail SMTP Port 587" };
  } catch (err587) {
    try {
      const sslTransporter = createTransporter(465);
      const info = await sslTransporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId, deliveredVia: "Gmail SMTP Port 465" };
    } catch (err465) {
      return { success: false, error: err465.message };
    }
  }
};
