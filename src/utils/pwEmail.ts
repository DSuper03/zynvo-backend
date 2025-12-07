export function generatePasswordEmailHtml(name: string, generatedPassword: string): string {
  const year = new Date().getFullYear();
  const safeName = name ?? "User";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Your new password</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:#f6f8fb; margin:0; padding:20px; }
      .container { max-width:640px; margin:24px auto; background:#ffffff; border-radius:8px; padding:24px; box-shadow:0 8px 24px rgba(20,20,50,0.06); color:#111827; }
      .header { text-align:center; margin-bottom:16px; }
      .title { font-size:20px; font-weight:600; margin:0; }
      .subtitle { font-size:14px; color:#6b7280; margin:4px 0 0; }
      .content { margin-top:18px; font-size:15px; line-height:1.5; color:#374151; }
      .pw-box { display:inline-block; background:#f3f4f6; border-radius:6px; padding:12px 16px; font-weight:700; font-size:16px; letter-spacing:0.6px; margin:12px 0; }
      .btn { display:inline-block; background:#fbbf24; color:#000; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600; margin-top:12px; }
      .note { font-size:13px; color:#6b7280; margin-top:14px; }
      .footer { margin-top:22px; font-size:12px; color:#9ca3af; text-align:center; }
      @media (max-width:480px){ .container{padding:16px} }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="title">Welcome to Zynvo</h1>
        <p class="subtitle">A temporary password has been generated for your account</p>
      </div>

      <div class="content">
        <p>Hi ${escapeHtml(safeName)},</p>

        <p>We generated a temporary password for your account. Use it to sign in, then please change your password from your dashboard.</p>

        <div class="pw-box" aria-label="temporary-password">${escapeHtml(generatedPassword)}</div>

        <p>
          <a class="btn" href="https://zynvo.social/auth/signin" target="_blank" rel="noopener noreferrer">Sign in to Zynvo</a>
        </p>

        <p class="note">
          If you did not request this password, please contact our support immediately.
        </p>
      </div>

      <div class="footer">
        <div>© ${year} Zynvo. All rights reserved.</div>
      </div>
    </div>
  </body>
</html>`;
}

// small helper to avoid injecting raw HTML
function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}