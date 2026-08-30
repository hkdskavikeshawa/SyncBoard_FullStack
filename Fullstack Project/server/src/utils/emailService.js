import nodemailer from 'nodemailer';

/**
 * Creates and configures a Nodemailer transporter.
 * Uses SMTP variables from environment if defined, otherwise creates an Ethereal test account.
 */
const getTransporter = async () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Create an Ethereal test account automatically for local development/testing
  console.log('ℹ️ No custom SMTP configuration found. Creating Nodemailer Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Sends a board invitation email to the target user.
 * @param {Object} options
 * @param {string} options.toEmail - Recipient email address
 * @param {string} options.inviterName - Name of the user sending the invite
 * @param {string} options.boardName - Name of the board
 */
export const sendInviteEmail = async ({ toEmail, inviterName, boardName }) => {
  try {
    const transporter = await getTransporter();

    const fromAddress = process.env.SMTP_FROM || '"SyncBoard" <no-reply@syncboard.app>';
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `You've been invited to join "${boardName}" on SyncBoard!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; border-radius: 12px;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #1e293b; padding: 32px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">SyncBoard</h1>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Collaborative Workspace</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;" />
            
            <h2 style="color: #f1f5f9; font-size: 20px; margin-top: 0;">You've been invited! 🎉</h2>
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
              <strong style="color: #38bdf8;">${inviterName || 'A teammate'}</strong> has invited you to collaborate on the board <strong style="color: #10b981;">"${boardName}"</strong> on SyncBoard.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${clientUrl}" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                Open SyncBoard
              </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin-top: 32px; border-top: 1px solid #334155; padding-top: 16px;">
              If you did not expect this invitation, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Invitation email sent to ${toEmail}. Message ID: ${info.messageId}`);

    // If using Ethereal test account, output preview URL in terminal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 Preview email online: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ Failed to send invitation email:', error);
    // Don't break the controller response, log error and return status
    return { success: false, error: error.message };
  }
};
