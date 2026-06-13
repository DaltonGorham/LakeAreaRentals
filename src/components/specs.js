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

const mpg = (specs) => {
  if (!isMissing(specs.mpg_city) && !isMissing(specs.mpg_highway))
    return `${specs.mpg_city} / ${specs.mpg_highway}`;
  if (!isMissing(specs.mpg_est)) return `~${specs.mpg_est}`;
  return null;
};

// Short highlight line for cards — { Icon, text }. Reads from item.specs.
const HIGHLIGHT_BUILDERS = {
  car: ({ specs }) => [
    { Icon: SeatIcon, text: `${specs.seats} seats` },
    { Icon: FuelIcon, text: specs.fuel_type },
    mpg(specs) && { Icon: GaugeIcon, text: `${mpg(specs)} mpg` },
  ],
  sxs: ({ specs }) => [
    { Icon: SeatIcon, text: `${specs.seats} seats` },
    { Icon: FuelIcon, text: specs.fuel_type },
    !isMissing(specs.horse_power) && { Icon: BoltIcon, text: `${specs.horse_power} hp` },
  ],
  rv: ({ specs }) => [
    { Icon: BedIcon, text: `Sleeps ${specs.sleeps}` },
    { Icon: FuelIcon, text: specs.fuel_type },
    mpg(specs) && { Icon: GaugeIcon, text: `${mpg(specs)} mpg` },
  ],
  trailer: ({ specs }) => [
    { Icon: RulerIcon, text: specs.length },
    { Icon: RampIcon, text: specs.loading_ramps ? 'Ramps' : 'No ramps' },
  ],
};

export function getFeatures(type, item) {
  const features = Array.isArray(item.features) ? item.features : [];

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
  const imgs = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  return imgs.length ? imgs : [PLACEHOLDER_IMAGE];
}

export const CONTACT = {
  phone: '501-250-6398',
  phoneHref: 'tel:501-250-6398',
  email: 'info@lakearearentalsllc.com',
  emailHref: 'mailto:info@lakearearentalsllc.com',
};
