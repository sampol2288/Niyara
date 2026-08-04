import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Ensure .env is loaded regardless of process launch directory
const envPath = fs.existsSync(path.resolve(process.cwd(), ".env"))
  ? path.resolve(process.cwd(), ".env")
  : fs.existsSync(path.resolve(process.cwd(), "backend/.env"))
  ? path.resolve(process.cwd(), "backend/.env")
  : path.resolve(process.cwd(), "../.env");

dotenv.config({ path: envPath });

// Create Nodemailer Transporter
const createTransporter = () => {
  const user = process.env.SMTP_USER || "polarasmit2504@gmail.com";
  const rawPass = process.env.SMTP_PASS || "hrvx obeb bnga dule";
  const pass = rawPass.replace(/\s+/g, "");

  // Use Nodemailer built-in Gmail service configuration for maximum reliability
  if (user.endsWith("@gmail.com") || (process.env.SMTP_HOST && process.env.SMTP_HOST.includes("gmail"))) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass
      }
    });
  }

  // Generic custom SMTP host configuration
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
};

/**
 * Sends OTP Email via Nodemailer Gmail Engine
 */
export const sendOTPEmail = async (toEmail, otpCode, purpose = "Verification", name = "Member") => {
  const userEmail = process.env.SMTP_USER || "polarasmit2504@gmail.com";
  const rawPass = process.env.SMTP_PASS || "hrvx obeb bnga dule";

  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH INITIATED]`);
  console.log(`  To: ${toEmail}`);
  console.log(`  OTP Code: ${otpCode}`);
  console.log(`  From Account: ${userEmail}`);
  console.log(`======================================================\n`);

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"NIYARA Concierge" <${userEmail}>`,
    to: toEmail,
    subject: `[NIYARA Security] Your ${purpose} Verification Code: ${otpCode}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 2rem; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #c5a072;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <h1 style="font-family: Georgia, serif; letter-spacing: 0.1em; color: #c5a072; margin: 0;">NIYARA</h1>
          <p style="font-size: 0.75rem; letter-spacing: 0.15em; color: #a1a1aa; text-transform: uppercase;">Archival Fashion Concierge</p>
        </div>
        <p style="font-size: 0.95rem; color: #e4e4e7;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 0.9rem; color: #a1a1aa; line-height: 1.5;">
          Use the following 6-digit Security OTP code to complete your ${purpose.toLowerCase()} request:
        </p>
        <div style="background: rgba(197, 160, 114, 0.15); border: 1px dashed #c5a072; border-radius: 8px; padding: 1.25rem; text-align: center; margin: 1.5rem 0;">
          <span style="font-size: 2.25rem; font-weight: 800; letter-spacing: 0.35em; color: #c5a072;">${otpCode}</span>
        </div>
        <p style="font-size: 0.8rem; color: #71717a; text-align: center;">
          This security code expires in 10 minutes. If you did not initiate this request, please ignore this email.
        </p>
        <div style="border-top: 1px solid #27272a; margin-top: 1.5rem; padding-top: 1rem; text-align: center; font-size: 0.7rem; color: #71717a;">
          © 2026 NIYARA Archival Fashion Portal. All rights reserved.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Gmail Dispatch Success] Sent to ${toEmail} | Message ID: ${info.messageId}`);
    return {
      success: true,
      deliveredVia: "Gmail Nodemailer Engine",
      messageId: info.messageId
    };
  } catch (error) {
    console.error(`[Gmail Dispatch Error]: ${error.message}`);
    return {
      success: false,
      error: error.message,
      otpCode
    };
  }
};
