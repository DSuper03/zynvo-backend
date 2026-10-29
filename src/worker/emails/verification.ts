
export const getSignupVerificationEmailHTML = (name: string, verificationUrl: string): string => {
    return `  <div style="font-family: Arial, sans-serif; padding: 0; margin: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td>
          <img 
            src="https://pbs.twimg.com/profile_banners/1916901326887522304/1750314868/1500x500" 
            alt="Welcome to Zynvo" 
            style="width: 100%; height: auto; display: block;"
          />
        </td>
      </tr>

      <tr>
        <td style="padding: 24px;">
          <h2 style="color: #333333;">Hey there! ${name} 👋</h2>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Welcome to <strong>Zynvo</strong>! You've got excellent taste in platforms (we're not biased at all).
          </p>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            We just need to make sure you're not a robot trying to take over the world. 🤖
          </p>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            <strong>Click the link below and boom – you're officially part of the cool kids club:</strong>
          </p>

          <p style="margin: 24px 0;">
            <a 
              href="${verificationUrl}" 
              style="background-color: #facc15; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;"
            >
              Verify My Account
            </a>
          </p>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Got questions? Just reply to this email — we're always here to help.
          </p>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Welcome aboard! <br />
            The Zynvo Team 🚀
          </p>

          <p style="color: #999999; font-size: 14px; font-style: italic;">
            P.S. This link expires in 24 hours, so don't overthink it like choosing a Netflix show.
          </p>
        </td>
      </tr>
    </table>
  </div>`;
};

export const getResendVerificationEmailHTML = (name: string, verificationUrl: string): string => {
    return `  <div style="font-family: Arial, sans-serif; padding: 0; margin: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td>
          <img 
            src="https://pbs.twimg.com/profile_banners/1916901326887522304/1750314868/1500x500" 
            alt="Welcome to Zynvo" 
            style="width: 100%; height: auto; display: block;"
          />
        </td>
      </tr>

      <tr>
        <td style="padding: 24px;">
          <h2 style="color: #333333;">Resend Verification Link</h2>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Hi ${name},<br/>
            It looks like you requested a new verification link for your Zynvo account.
          </p>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Click the button below to verify your email and activate your account:
          </p>

          <p style="margin: 24px 0;">
            <a 
              href="${verificationUrl}" 
              style="background-color: #facc15; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;"
            >
              Verify My Account
            </a>
          </p>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            If you did not request this, you can safely ignore this email.
          </p>

          <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Best regards,<br />
            The Zynvo Team 🚀
          </p>

          <p style="color: #999999; font-size: 14px; font-style: italic;">
            This link expires in 24 hours.
          </p>
        </td>
      </tr>
    </table>
  </div>`;
};
