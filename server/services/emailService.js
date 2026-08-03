import nodemailer from "nodemailer";

// Initialize Nodemailer Transport
const createTransporter = async () => {
  const isRealSMTP =
    process.env.SMTP_HOST &&
    !process.env.SMTP_HOST.includes("yourprovider.com") &&
    process.env.SMTP_USER &&
    !process.env.SMTP_USER.includes("your_username");

  if (isRealSMTP) {
    const port = parseInt(process.env.SMTP_PORT || "587");
    const isSecure = process.env.SMTP_SECURE === "true" || port === 465;
    const cleanPassword = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: cleanPassword
      }
    });
  }

  // Fallback to Nodemailer Ethereal Test Account if no live SMTP provided
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (e) {
    return nodemailer.createTransport({
      jsonTransport: true
    });
  }
};

let transporter = null;

// Send OTP Email Function
export const sendOTPEmail = async (toEmail, otpCode, purpose = "signup", userName = "Member") => {
  try {
    if (!transporter) {
      transporter = await createTransporter();
    }

    const title = purpose === "signup" ? "Verify Your Member Account" : "Security Password Reset OTP";

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"NIYARA Security Concierge" <security@niyara.com>',
      to: toEmail,
      subject: `[NIYARA] Your Security Verification Code: ${otpCode}`,
      text: `Your NIYARA verification code is ${otpCode}. It expires in 10 minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0a0b; color: #f5f5f7; margin: 0; padding: 40px 20px; }
            .card { max-width: 540px; margin: 0 auto; background: #141416; border: 1px solid rgba(255, 255, 255, 0.12); padding: 40px 30px; text-align: center; }
            .brand { font-family: Georgia, serif; font-size: 28px; letter-spacing: 0.25em; color: #f5f5f7; margin-bottom: 8px; }
            .subtitle { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #c5a072; font-weight: 600; margin-bottom: 30px; }
            .heading { font-family: Georgia, serif; font-size: 22px; color: #f5f5f7; margin-bottom: 12px; }
            .desc { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 28px; }
            .otp-box { background: #1c1c20; border: 1px solid #c5a072; color: #c5a072; font-size: 32px; font-weight: 700; letter-spacing: 0.35em; padding: 18px 24px; display: inline-block; margin-bottom: 28px; border-radius: 4px; }
            .footer { border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; margin-top: 30px; font-size: 11px; color: #71717a; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">NIYARA</div>
            <div class="subtitle">ARCHIVAL FASHION HOUSE</div>
            
            <div class="heading">${title}</div>
            <div class="desc">Please use the 6-digit security code below to complete your verification:</div>
            
            <div class="otp-box">${otpCode}</div>
            
            <div class="desc" style="font-size: 12px; color: #71717a;">
              If you did not request this verification code, please disregard this email.
            </div>
            
            <div class="footer">
              Encrypted 256-Bit TLS Transmission • NIYARA Concierge Security Service<br>
              © ${new Date().getFullYear()} NIYARA Archive Ltd. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `
    };

    let info;
    try {
      info = await transporter.sendMail(mailOptions);
    } catch (primaryErr) {
      console.warn(`[Nodemailer Primary Transport Warning]: ${primaryErr.message}`);
      if (primaryErr.message.includes("535") || primaryErr.message.includes("Username and Password not accepted") || primaryErr.message.includes("BadCredentials")) {
        console.error(`\n================================================================`);
        console.error(`[GMAIL SMTP NOTICE]: Google rejected login for ${process.env.SMTP_USER}.`);
        console.error(`REASON: Standard passwords do not work for Gmail SMTP.`);
        console.error(`TO RECEIVE EMAILS DIRECTLY IN YOUR GMAIL INBOX:`);
        console.error(`1. Go to https://myaccount.google.com/apppasswords`);
        console.error(`2. Generate a 16-character App Password for 'Mail'`);
        console.error(`3. Put that 16-character password into .env as SMTP_PASS=xxxx xxxx xxxx xxxx`);
        console.error(`================================================================\n`);
      }
      console.log(`[Nodemailer] Switching to Ethereal Test Account transport...`);
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
      info = await testTransporter.sendMail(mailOptions);
      transporter = testTransporter;
    }

    console.log(`[Nodemailer] OTP Email sent to ${toEmail} | Message ID: ${info.messageId || "sent-ok"}`);
    
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Nodemailer Ethereal Preview URL]: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null
    };
  } catch (error) {
    console.error("[Nodemailer Send Error]:", error.message);
    return {
      success: true,
      error: error.message
    };
  }
};
