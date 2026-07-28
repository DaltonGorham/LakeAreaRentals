import { CATEGORY_META, getHighlights, getImages, formatShortDate } from './specs';
import { vehicleHref } from '../lib/inventory';

export default function InventoryCard({ item, type, availability }) {
  const meta = CATEGORY_META[type] || {};
  const images = getImages(item);
  const highlights = getHighlights(type, item);
  const Icon = meta.Icon;

  return (
    <a
      href={vehicleHref(type, item.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative bg-cream rounded-md overflow-hidden shadow-card hover:shadow-[0_16px_32px_-12px_rgba(28,31,23,0.35)] transition-shadow pb-16">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-shade">
          <img
            src={images[0]}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* category stamp */}
          {Icon && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 bg-paper/95 text-ink font-display text-[0.65rem] uppercase tracking-[0.2em] px-2.5 py-1 border-2 border-ink rounded-[2px]">
              <Icon className="text-sm" />
              {meta.label}
            </span>
          )}
          {/* availability stamp */}
          {availability && (
            <span
              className={`absolute top-2 right-2 inline-flex items-center gap-1.5 font-display text-[0.65rem] uppercase tracking-[0.2em] px-2.5 py-1 border-2 rounded-[2px] ${
                availability.available
                  ? 'bg-forest-700/95 text-paper border-forest-700'
                  : 'bg-rust-500/95 text-paper border-rust-500'
              }`}
            >
              {availability.available
                ? 'Available'
                : availability.returnDate
                ? `Back ${formatShortDate(availability.returnDate)}`
                : 'Rented'}
            </span>
          )}
          {/* view cue */}
          <span className="absolute bottom-2 right-2 bg-ink text-paper font-display text-[0.65rem] uppercase tracking-[0.18em] px-3 py-1.5 rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
            View →
          </span>
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-display text-lg sm:text-xl text-ink leading-tight line-clamp-1">
            {item.name}
          </h3>
          {highlights.length > 0 && (
            <ul className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-editorial italic text-sm text-ink-soft">
              {highlights.map((h, i) => (
                <li key={i} className="inline-flex items-center gap-1.5">
                  <h.Icon className="text-rust-500 not-italic text-base" />
                  {h.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </a>
  );
}
