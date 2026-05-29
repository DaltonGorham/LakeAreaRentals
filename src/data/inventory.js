import cars from './cars.json';
import sxs from './sxs.json';
import rv from './rv.json';
import trailers from './trailers.json';

// Single merged list with a normalized `_type` tag.
export const ALL_ITEMS = [
  ...cars.map((c) => ({ ...c, _type: 'car' })),
  ...sxs.map((s) => ({ ...s, _type: 'sxs' })),
  ...rv.map((r) => ({ ...r, _type: 'rv' })),
  ...trailers.map((t) => ({ ...t, _type: 'trailer' })),
];

export function findItem(type, id) {
  return ALL_ITEMS.find((i) => i._type === type && String(i.id) === String(id)) || null;
}

export function vehicleHref(type, id) {
  return `/inventory/${type}/${id}`;
}
