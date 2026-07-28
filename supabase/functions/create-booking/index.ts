import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyTurnstile } from '../_shared/turnstile.ts';

// Creates a pending booking request. This is the only way a row can land in
// public.rentals from the public site — the table's RLS no longer allows a direct
// anon insert (see the lock_down_rentals_insert_for_turnstile migration), so every
// request must pass Turnstile verification here first.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const {
    turnstile_token,
    inventory_id,
    start_date,
    end_date,
    renter_name,
    renter_email,
    renter_phone,
    agreement_path,
  } = body as Record<string, string | null | undefined>;

  if (!turnstile_token) {
    return new Response(JSON.stringify({ error: 'Bot verification is required.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const remoteIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const verified = await verifyTurnstile(turnstile_token, remoteIp);
  if (!verified) {
    return new Response(JSON.stringify({ error: 'Bot verification failed. Please try again.' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!inventory_id || !start_date || !end_date || !renter_name || !agreement_path) {
    return new Response(JSON.stringify({ error: 'Missing required booking fields.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!renter_email && !renter_phone) {
    return new Response(JSON.stringify({ error: 'An email or phone number is required.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Service-role client: this function is the trusted gate now that direct anon
  // inserts are disabled, so it inserts on the caller's behalf after verification.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data, error } = await supabase
    .from('rentals')
    .insert({
      inventory_id,
      start_date,
      end_date,
      renter_name,
      renter_email: renter_email || null,
      renter_phone: renter_phone || null,
      agreement_path,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Insert error:', error.message);
    const conflict = error.code === '23P01'; // exclusion constraint violation
    return new Response(
      JSON.stringify({
        error: conflict
          ? 'Those dates are no longer available for this vehicle.'
          : 'Could not create booking request.',
      }),
      {
        status: conflict ? 409 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(JSON.stringify({ id: data.id }), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
