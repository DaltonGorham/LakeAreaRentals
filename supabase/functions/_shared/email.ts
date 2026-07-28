// Shared by the notify-booking, notify-approval, and notify-decline Edge Functions.

export function escapeHtml(value: unknown): string {
  const str = value == null ? '' : String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Formats a 'YYYY-MM-DD' date string as e.g. "Monday, August 3, 2026".
// Parsed as local-time components (not Date.parse) to avoid UTC-shift bugs.
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBD';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Wraps body content in the site's branded email shell — forest header,
// cream body, dark footer — so every outbound email looks consistent.
export function renderEmail(heading: string, bodyHtml: string): string {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; background:#f1e4c3; padding:32px 16px;">
      <div style="max-width:520px; margin:0 auto; background:#faf3df; border:2px solid #1c1f17;">
        <div style="background:#224018; color:#faf3df; padding:20px 28px;">
          <div style="font-family: Arial, Helvetica, sans-serif; font-weight:bold; letter-spacing:0.05em; font-size:14px; text-transform:uppercase;">
            Lake Area Rentals
          </div>
        </div>
        <div style="padding:28px;">
          <h1 style="font-family: Arial, Helvetica, sans-serif; font-size:22px; color:#224018; margin:0 0 16px;">${heading}</h1>
          <div style="font-size:15px; line-height:1.65; color:#1c1f17;">
            ${bodyHtml}
          </div>
        </div>
        <div style="background:#1c1f17; color:#f1e4c3; padding:16px 28px; font-family: Arial, Helvetica, sans-serif; font-size:12px;">
          Heber Springs &amp; Rose Bud, Arkansas &middot; (501) 250-6398 &middot; info@lakearearentalsllc.com
        </div>
      </div>
    </div>
  `;
}

// A button-style CTA link, styled to match the site's rust accent.
export function renderButton(text: string, href: string): string {
  return `
    <p style="margin:24px 0 0;">
      <a href="${href}" style="display:inline-block; background:#c14a26; color:#faf3df; text-decoration:none; font-family: Arial, Helvetica, sans-serif; font-weight:bold; text-transform:uppercase; letter-spacing:0.05em; font-size:13px; padding:12px 22px;">
        ${escapeHtml(text)} &rarr;
      </a>
    </p>
  `;
}

export async function sendEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      ...(params.replyTo ? { reply_to: params.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text };
  }
  return { ok: true };
}
