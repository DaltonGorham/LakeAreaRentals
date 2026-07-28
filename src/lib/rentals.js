import { supabase } from './supabase';

// Rows: { id, inventory_id, start_date, end_date, status, renter_name, renter_phone,
//         renter_email, notes, created_at, updated_at }
// status is 'pending' | 'approved' | 'declined'. Availability is derived, not stored:
// a vehicle is rented whenever today falls inside an *approved* row's
// [start_date, end_date] range. Pending requests don't block other customers until
// staff approve them.
//
// The raw table is admin-only for reads (RLS). Public availability goes through the
// get_approved_rental_windows() RPC, which only ever returns inventory_id/start_date/
// end_date for approved bookings — never renter PII.

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Admin-only: full rows (incl. renter PII) for one vehicle. Used by the admin bookings panel.
export async function fetchRentalsForItem(inventoryId) {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('inventory_id', inventoryId)
    .order('start_date');
  if (error) throw error;
  return data;
}

// Admin-only: everything still relevant across the whole fleet — pending requests plus
// approved bookings that haven't ended yet (currently out or upcoming), including
// open-ended bookings with no known return date (e.g. insurance-claim replacements).
// Excludes declined and past rows. Used to build the admin "outstanding rentals" overview.
export async function fetchOutstandingRentals() {
  const { data, error } = await supabase
    .from('rentals')
    .select('*, inventory:inventory_id (name, type)')
    .in('status', ['pending', 'approved'])
    .or(`end_date.is.null,end_date.gte.${todayStr()}`)
    .order('start_date');
  if (error) throw error;
  return data;
}

// Public-safe: one vehicle's approved, still-relevant booking windows (no PII).
export async function fetchApprovedWindowsForItem(inventoryId) {
  const { data, error } = await supabase.rpc('get_approved_rental_windows', {
    p_inventory_id: inventoryId,
  });
  if (error) throw error;
  return data;
}

// Public-safe: every vehicle's approved, still-relevant booking windows, keyed by
// inventory_id. Used to annotate the inventory list/cards without an N+1 query per item.
export async function fetchCurrentAndUpcomingRentals() {
  const { data, error } = await supabase.rpc('get_approved_rental_windows');
  if (error) throw error;

  const byItem = {};
  for (const rental of data) {
    (byItem[rental.inventory_id] ??= []).push(rental);
  }
  return byItem;
}

// Given a vehicle's approved rental windows, returns its availability as of today.
// A null end_date means an open-ended rental (e.g. an insurance-claim replacement
// with no known return date yet) — it counts as ongoing indefinitely.
export function getAvailability(rentals) {
  const today = todayStr();
  const current = (rentals || []).find(
    (r) => r.start_date <= today && (r.end_date === null || r.end_date >= today)
  );
  if (current) {
    return { available: false, returnDate: current.end_date, nextBooking: null };
  }

  const nextBooking =
    (rentals || [])
      .filter((r) => r.start_date > today)
      .sort((a, b) => a.start_date.localeCompare(b.start_date))[0] || null;
  return { available: true, returnDate: null, nextBooking };
}

// --- Public write: customers request a booking (always lands as 'pending') ---

// Routed through the create-booking Edge Function rather than a direct table
// insert — the table no longer has a public insert policy, since the function is
// what verifies the Turnstile token before the row is created.
export async function createBookingRequest(rental) {
  const { data, error } = await supabase.functions.invoke('create-booking', {
    body: rental,
  });
  if (error) {
    // FunctionsHttpError wraps the real error response — surface its message if present.
    const message = await error.context?.json?.().then((b) => b.error).catch(() => null);
    throw new Error(message || error.message || 'Could not submit booking request.');
  }
  return data;
}

// --- Admin writes (require an authenticated admin session; enforced by RLS) ---

export async function createRental(rental) {
  const { data, error } = await supabase.from('rentals').insert(rental).select().single();
  if (error) throw error;
  return data;
}

export async function updateRental(id, patch) {
  const { data, error } = await supabase
    .from('rentals')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function approveRental(id) {
  const rental = await updateRental(id, { status: 'approved' });
  // Best-effort confirmation email to the renter — approval already succeeded either way.
  supabase.functions.invoke('notify-approval', { body: { rental_id: id } }).catch(() => {});
  return rental;
}

export async function declineRental(id, reason) {
  const rental = await updateRental(id, {
    status: 'declined',
    decline_reason: reason?.trim() || null,
  });
  // Best-effort notice to the renter — decline already succeeded either way.
  supabase.functions.invoke('notify-decline', { body: { rental_id: id } }).catch(() => {});
  return rental;
}

export async function deleteRental(id) {
  const { error } = await supabase.from('rentals').delete().eq('id', id);
  if (error) throw error;
}
