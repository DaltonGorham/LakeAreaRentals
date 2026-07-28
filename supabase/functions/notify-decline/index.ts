import { createClient } from 'jsr:@supabase/supabase-js@2';
import { escapeHtml, formatDate, renderEmail, sendEmail } from '../_shared/email.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Fires when staff decline a booking request. Lets the renter know directly
// rather than leaving them waiting. See notify-approval for the confirmation
// email sent when a request is approved instead.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  let rental_id: string | undefined;
  try {
    ({ rental_id } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!rental_id) {
    return new Response(JSON.stringify({ error: 'rental_id is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Service-role client: re-fetches the booking server-side rather than trusting
  // whatever the caller sent, so the email always reflects the real stored row.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: rental, error } = await supabase
    .from('rentals')
    .select('*, inventory:inventory_id (name, type)')
    .eq('id', rental_id)
    .single();

  if (error || !rental) {
    return new Response(JSON.stringify({ error: 'Rental not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (rental.status !== 'declined') {
    return new Response(JSON.stringify({ error: 'Rental is not declined' }), {
      status: 409,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Nothing to notify if this booking has no renter email on file (e.g. an
  // admin-entered phone booking) — that's expected, not an error.
  if (!rental.renter_email) {
    return new Response(JSON.stringify({ skipped: true, reason: 'No renter email on file' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    console.error('RESEND_API_KEY secret is not set; skipping email send.');
    return new Response(JSON.stringify({ error: 'Email is not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const from = Deno.env.get('RESEND_FROM') || 'Lake Area Rentals <onboarding@resend.dev>';
  const vehicleName = rental.inventory?.name || 'that rental';

  const html = renderEmail(
    "We can't make those dates work",
    `
      <p>Hi ${escapeHtml(rental.renter_name || 'there')},</p>
      <p>
        Thanks for your interest in the ${escapeHtml(vehicleName)}. Unfortunately we're not
        able to accommodate your requested dates
        (${escapeHtml(formatDate(rental.start_date))} &mdash; ${escapeHtml(formatDate(rental.end_date))}).
      </p>
      ${
        rental.decline_reason
          ? `<p><strong>Reason:</strong> ${escapeHtml(rental.decline_reason)}</p>`
          : ''
      }
      <p>
        Feel free to check our other available dates and vehicles, or give us a call at
        (501) 250-6398 and we'll help you find something that works.
      </p>
      <p>Thanks,<br>Lake Area Rentals</p>
    `
  );

  const result = await sendEmail({
    apiKey: resendApiKey,
    from,
    to: rental.renter_email,
    replyTo: 'info@lakearearentalsllc.com',
    subject: `About your ${vehicleName} request`,
    html,
  });

  if (!result.ok) {
    console.error('Resend error:', result.error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
