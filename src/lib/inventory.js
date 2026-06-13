import { supabase } from './supabase';

// Display order across categories: cars, then SXS, then RVs, then trailers.
const TYPE_ORDER = { car: 0, sxs: 1, rv: 2, trailer: 3 };

// Rows come back in their natural shape:
//   { id, type, name, category, images, features, specs, created_at, updated_at }
// Category-specific fields live under `specs` (e.g. specs.mpg_city, specs.seats).

export async function fetchAllItems() {
  const { data, error } = await supabase.from('inventory').select('*');
  if (error) throw error;
  return [...data].sort(
    (a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type] || a.name.localeCompare(b.name)
  );
}

export async function fetchItem(id) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export function vehicleHref(type, id) {
  return `/inventory/${type}/${id}`;
}

// Returns a representative image URL per type, e.g. { car, sxs, rv, trailer }.
// Used by marketing pages (landing/about) that need one image per category
// without hardcoding paths. Types with no usable image are simply omitted.
export async function fetchCategoryImages() {
  const items = await fetchAllItems();
  const byType = {};
  for (const item of items) {
    if (byType[item.type]) continue;
    const img = Array.isArray(item.images) ? item.images.find(Boolean) : null;
    if (img) byType[item.type] = img;
  }
  return byType;
}

// --- Admin writes (require an authenticated admin session; enforced by RLS) ---

export async function createItem(item) {
  const { data, error } = await supabase.from('inventory').insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateItem(id, patch) {
  const { data, error } = await supabase
    .from('inventory')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteItem(id) {
  const { error } = await supabase.from('inventory').delete().eq('id', id);
  if (error) throw error;
}
