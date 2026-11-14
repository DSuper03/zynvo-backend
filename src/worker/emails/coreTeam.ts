import { escapeHtml } from '../mail';

// Emails for core-team "add by email". All interpolated values are escaped.

const layout = (heading: string, body: string, ctaLabel: string, ctaUrl: string, footer: string): string => `
  <div style="font-family: Arial, sans-serif; padding: 0; margin: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 24px;">
          <h2 style="color: #333333;">${heading}</h2>
          ${body}
          <p style="margin: 24px 0;">
            <a href="${escapeHtml(ctaUrl)}"
               style="background-color: #facc15; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              ${ctaLabel}
            </a>
          </p>
          <p style="color: #888888; font-size: 13px; line-height: 1.6;">${footer}</p>
        </td>
      </tr>
    </table>
  </div>`;

const p = (text: string) => `<p style="color: #555555; font-size: 16px; line-height: 1.6;">${text}</p>`;

/** Sent to an existing user who was just added to a club's core team. */
export const coreTeamAddedEmail = (opts: { clubName: string; inviterName: string; url: string }) => ({
  subject: `You're now on the ${opts.clubName} core team`,
  html: layout(
    `Welcome to the core team 🎉`,
    p(`<strong>${escapeHtml(opts.inviterName)}</strong> added you to the core team of <strong>${escapeHtml(opts.clubName)}</strong> on Zynvo.`) +
      p(`You can now help manage the club's events and download participant CSVs.`),
    'Open the club',
    opts.url,
    `If you weren't expecting this, you can ignore this email or ask the club head to remove you.`,
  ),
});

/** Sent to an email with no verified Zynvo account. */
export const coreTeamInviteEmail = (opts: { clubName: string; inviterName: string; url: string; expiresAt: Date }) => ({
  subject: `You're invited to the ${opts.clubName} core team on Zynvo`,
  html: layout(
    `You've been invited 👋`,
    p(`<strong>${escapeHtml(opts.inviterName)}</strong> invited you to join the core team of <strong>${escapeHtml(opts.clubName)}</strong> on Zynvo.`) +
      p(`Sign up (or sign in) with <strong>this email address</strong> and verify it, and you'll be added automatically.`),
    'Accept invite',
    opts.url,
    `This invite expires on ${escapeHtml(opts.expiresAt.toUTCString())}. If you weren't expecting it, you can ignore this email.`,
  ),
});
