export const emailTemplates = {
  verification: (name: string, verificationUrl: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="padding: 24px;">
        <h2 style="color: #333;">Welcome to Zynvo, ${name}!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          You're one click away from joining the Zynvo community.
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Click the button below to verify your account:
        </p>
        <p style="margin: 24px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #facc15; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Verify Account
          </a>
        </p>
        <p style="color: #999; font-size: 14px; font-style: italic;">
          This link expires in 24 hours.
        </p>
      </div>
    </div>
  `,

  resendVerification: (name: string, verificationUrl: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="padding: 24px;">
        <h2 style="color: #333;">Resend Verification Link</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Hi ${name},
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          You requested a new verification link for your Zynvo account.
        </p>
        <p style="margin: 24px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #facc15; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Verify Account
          </a>
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 14px; font-style: italic;">
          This link expires in 24 hours.
        </p>
      </div>
    </div>
  `
};
