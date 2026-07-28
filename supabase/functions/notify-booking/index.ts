import { createClient } from 'jsr:@supabase/supabase-js@2';
import { escapeHtml, formatDate, renderEmail, renderButton, sendEmail } from '../_shared/email.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Fires when a customer submits a booking request. Notifies staff at
// info@lakearearentalsllc.com — never the renter. See notify-approval for the
// customer-facing confirmation sent once staff approve the request.
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

  if (rental.notified_at) {
    return new Response(JSON.stringify({ skipped: true, reason: 'Already notified' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Atomically claim the "send" slot before actually sending — if this update
  // affects no row, another concurrent call already claimed it, so we skip.
  // This is what makes repeatedly invoking this endpoint for the same rental
  // (e.g. someone hammering it with curl) only ever send one real email.
  const { data: claimed } = await supabase
    .from('rentals')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', rental_id)
    .is('notified_at', null)
    .select('id')
    .maybeSingle();

  if (!claimed) {
    return new Response(JSON.stringify({ skipped: true, reason: 'Already notified' }), {
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
  const vehicleName = rental.inventory?.name || 'a vehicle';

  const html = renderEmail(
    'New booking request',
    `
      <p><strong>Vehicle:</strong> ${escapeHtml(vehicleName)}</p>
      <p><strong>Dates:</strong> ${escapeHtml(formatDate(rental.start_date))} &mdash; ${escapeHtml(formatDate(rental.end_date))}</p>
      <p><strong>Name:</strong> ${escapeHtml(rental.renter_name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(rental.renter_phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(rental.renter_email)}</p>
      <p><strong>Notes:</strong> ${escapeHtml(rental.notes)}</p>
      ${renderButton('Review in admin panel', 'https://lakearearentalsllc.com/admin')}
    `
  );

  const result = await sendEmail({
    apiKey: resendApiKey,
    from,
    to: 'info@lakearearentalsllc.com',
    subject: `New booking request — ${vehicleName}`,
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
