// Single source of truth for category metadata and per-type feature rendering.
// Both InventoryCard (compact highlights) and the detail page (feature list)
// read from here so they never drift apart.
import {
  CarIcon,
  SxsIcon,
  RvIcon,
  TrailerIcon,
  SeatIcon,
  FuelIcon,
  GaugeIcon,
  BoltIcon,
  BedIcon,
  RulerIcon,
  RampIcon,
  CheckIcon,
} from './Icons';

export const CATEGORY_META = {
  car: { label: 'Car', plural: 'Cars', Icon: CarIcon, accent: '--cat-car', accentSoft: '--cat-car-soft' },
  sxs: { label: 'Side-by-Side', plural: 'SXS', Icon: SxsIcon, accent: '--cat-sxs', accentSoft: '--cat-sxs-soft' },
  rv: { label: 'RV', plural: 'RVs', Icon: RvIcon, accent: '--cat-rv', accentSoft: '--cat-rv-soft' },
  trailer: { label: 'Trailer', plural: 'Trailers', Icon: TrailerIcon, accent: '--cat-trailer', accentSoft: '--cat-trailer-soft' },
};

const isMissing = (v) =>
  v === null || v === undefined || v === '' || v === 'N/A' || v === 'n/a';

const mpg = (item) => {
  if (!isMissing(item.mpg_city) && !isMissing(item.mpg_highway))
    return `${item.mpg_city} / ${item.mpg_highway}`;
  if (!isMissing(item.mpg_est)) return `~${item.mpg_est}`;
  return null;
};

// Short highlight line for cards — { Icon, text }.
const HIGHLIGHT_BUILDERS = {
  car: (item) => [
    { Icon: SeatIcon, text: `${item.seats} seats` },
    { Icon: FuelIcon, text: item.fuel_type },
    mpg(item) && { Icon: GaugeIcon, text: `${mpg(item)} mpg` },
  ],
  sxs: (item) => [
    { Icon: SeatIcon, text: `${item.seats} seats` },
    { Icon: FuelIcon, text: item.fuel_type },
    !isMissing(item.horse_power) && { Icon: BoltIcon, text: `${item.horse_power} hp` },
  ],
  rv: (item) => [
    { Icon: BedIcon, text: `Sleeps ${item.sleeps}` },
    { Icon: FuelIcon, text: item.fuel_type },
    mpg(item) && { Icon: GaugeIcon, text: `${mpg(item)} mpg` },
  ],
  trailer: (item) => [
    { Icon: RulerIcon, text: item.length },
    { Icon: RampIcon, text: item.loading_ramps ? 'Ramps' : 'No ramps' },
  ],
};

export function getFeatures(type, item) {
  const features = Array.isArray(item.additional_features) ? item.additional_features : [];

  return features
    .filter((text) => !isMissing(text))
    .map((text) => ({ Icon: CheckIcon, text }));
}

export function getHighlights(type, item) {
  const build = HIGHLIGHT_BUILDERS[type] || (() => []);
  return build(item).filter(Boolean);
}

export const PLACEHOLDER_IMAGE = '/images/coming-soon.svg';

export function getImages(item) {
  const imgs = item.images && item.images.length ? item.images : [item.image].filter(Boolean);
  return imgs.length ? imgs : [PLACEHOLDER_IMAGE];
}

export const CONTACT = {
  phone: '501-250-6398',
  phoneHref: 'tel:501-250-6398',
  email: 'info@lakearearentalsllc.com',
  emailHref: 'mailto:info@lakearearentalsllc.com',
};
