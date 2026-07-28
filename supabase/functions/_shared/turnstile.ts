// Verifies a Cloudflare Turnstile token server-side. This is the actual bot gate —
// the widget in the browser is just UX; the real check has to happen here, since a
// bot can always skip the browser and call the API directly.
export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY secret is not set; failing closed.');
    return false;
  }

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}
