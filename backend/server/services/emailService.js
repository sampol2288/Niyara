import nodemailer from "nodemailer";

/**
 * Verified default Gmail SMTP credentials.
 * Used when environment variables are missing to guarantee 100% email delivery uptime.
 */
const DEFAULT_SMTP_USER = "polarasmit2504@gmail.com";
const DEFAULT_SMTP_PASS = "hrvxobebbngadule";

const getCredentials = () => {
  const user = (process.env.SMTP_USER || DEFAULT_SMTP_USER).trim();
  const rawPass = process.env.SMTP_PASS || DEFAULT_SMTP_PASS;
  const pass = rawPass.replace(/\s+/g, "");
  return { user, pass };
};

/**
 * Creates Gmail service transporter with explicit timeouts to prevent hangs.
 */
const createGmailTransporter = () => {
  const { user, pass } = getCredentials();
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000
  });
};

/**
 * Creates custom host/port transporter with explicit timeouts.
 */
const createHostTransporter = (port = 465) => {
  const { user, pass } = getCredentials();
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000
  });
};

const getSenderAddress = () => {
  const { user } = getCredentials();
  return process.env.EMAIL_FROM || `"NIYARA Archival Concierge" <${user}>`;
};

/**
 * Send OTP verification email to recipient with multi-layer fallback.
 * NOTE: The OTP code itself is stored server-side and sent to the recipient's inbox.
 */
export const sendOTPEmail = async (toEmail, otpCode, purpose = "Verification", name = "Member") => {
  const senderAddress = getSenderAddress();

  console.log(`[OTP Email] Dispatching to: ${toEmail} | Purpose: ${purpose}`);

  const mailOptions = {
    from: senderAddress,
    to: toEmail,
    subject: `[NIYARA] Your ${purpose} Verification Code: ${otpCode}`,
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

  // Attempt 1: Gmail service (fastest, most reliable)
  try {
    const transporter = createGmailTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Dispatched via Gmail service | ID: ${info.messageId}`);
    return { success: true, deliveredVia: "Gmail Service", messageId: info.messageId };
  } catch (err1) {
    console.warn(`[Email] Gmail service failed: ${err1.message}. Trying Port 465 SSL...`);

    // Attempt 2: Port 465 SSL
    try {
      const sslTransporter = createHostTransporter(465);
      const info = await sslTransporter.sendMail(mailOptions);
      console.log(`[Email] Dispatched via Port 465 SSL | ID: ${info.messageId}`);
      return { success: true, deliveredVia: "Port 465 SSL", messageId: info.messageId };
    } catch (err2) {
      console.warn(`[Email] Port 465 failed: ${err2.message}. Trying Port 587...`);

      // Attempt 3: Port 587 STARTTLS
      try {
        const tlsTransporter = createHostTransporter(587);
        const info = await tlsTransporter.sendMail(mailOptions);
        console.log(`[Email] Dispatched via Port 587 | ID: ${info.messageId}`);
        return { success: true, deliveredVia: "Port 587 TLS", messageId: info.messageId };
      } catch (err3) {
        console.error(`[Email] All dispatch attempts failed. Last error: ${err3.message}`);
        return { success: false, error: err3.message };
      }
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
    const transporter = createGmailTransporter();
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId, deliveredVia: "Gmail Service" };
  } catch (err1) {
    try {
      const sslTransporter = createHostTransporter(465);
      const info = await sslTransporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId, deliveredVia: "Port 465 SSL" };
    } catch (err2) {
      try {
        const tlsTransporter = createHostTransporter(587);
        const info = await tlsTransporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId, deliveredVia: "Port 587 TLS" };
      } catch (err3) {
        return { success: false, error: err3.message };
      }
    }
  }
};
