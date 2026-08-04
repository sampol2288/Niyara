import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Ensure .env is loaded cleanly regardless of cwd
const envPath = fs.existsSync(path.resolve(process.cwd(), ".env"))
  ? path.resolve(process.cwd(), ".env")
  : fs.existsSync(path.resolve(process.cwd(), "backend/.env"))
  ? path.resolve(process.cwd(), "backend/.env")
  : path.resolve(process.cwd(), "../.env");

dotenv.config({ path: envPath });

const DEFAULT_SMTP_USER = "polarasmit2504@gmail.com";
const DEFAULT_SMTP_PASS = "hrvxobebbngadule";

// Create Nodemailer Transporters
const createTransporter = (port = 587) => {
  const user = (process.env.SMTP_USER || DEFAULT_SMTP_USER).trim();
  const rawPass = process.env.SMTP_PASS || DEFAULT_SMTP_PASS;
  const pass = rawPass.replace(/\s+/g, "");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: port,
    secure: port === 465, // true for 465, false for 587
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
};

/**
 * Generates secure 6-digit OTP code and dispatches real email to recipient
 */
export const sendOTPEmail = async (toEmail, otpCode, purpose = "Verification", name = "Member") => {
  const userEmail = (process.env.SMTP_USER || DEFAULT_SMTP_USER).trim();

  console.log(`\n======================================================`);
  console.log(`[REAL OTP EMAIL DISPATCH]`);
  console.log(`  Recipient: ${toEmail}`);
  console.log(`  Security Code: ${otpCode}`);
  console.log(`  Sender: ${userEmail}`);
  console.log(`======================================================\n`);

  const mailOptions = {
    from: `"NIYARA Archival Concierge" <${userEmail}>`,
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
          © 2026 NIYARA Archival Fashion Portal. All rights reserved.
        </div>
      </div>
    `
  };

  // Attempt 1: Port 587 STARTTLS
  try {
    const transporter = createTransporter(587);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Gmail 587 Success] Real OTP Email dispatched to ${toEmail} | ID: ${info.messageId}`);
    return {
      success: true,
      deliveredVia: "Gmail SMTP Port 587 Engine",
      messageId: info.messageId,
      otpCode
    };
  } catch (err587) {
    console.warn(`[Port 587 Failed]: ${err587.message}. Trying Port 465 Direct SSL...`);

    // Attempt 2: Port 465 SSL
    try {
      const sslTransporter = createTransporter(465);
      const info465 = await sslTransporter.sendMail(mailOptions);
      console.log(`[Gmail 465 Success] Real OTP Email dispatched to ${toEmail} | ID: ${info465.messageId}`);
      return {
        success: true,
        deliveredVia: "Gmail SMTP Port 465 Engine",
        messageId: info465.messageId,
        otpCode
      };
    } catch (err465) {
      console.error(`[Gmail Dispatch Failed on Port 465]: ${err465.message}`);
      return {
        success: false,
        error: err465.message,
        otpCode
      };
    }
  }
};
