import { CATEGORY_META, getHighlights, getImages } from './specs';
import { vehicleHref } from '../lib/inventory';

const TILTS = ['-rotate-1', 'rotate-1', '-rotate-[0.5deg]', 'rotate-[0.5deg]'];

export default function InventoryCard({ item, type }) {
  const meta = CATEGORY_META[type] || {};
  const images = getImages(item);
  const highlights = getHighlights(type, item);
  const tilt = TILTS[(item.name?.charCodeAt(0) ?? 0) % TILTS.length];
  const Icon = meta.Icon;

  return (
    <a
      href={vehicleHref(type, item.id)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block ${tilt} hover:rotate-0 transition-transform duration-300`}
    >
      <div className="relative bg-cream p-3 pb-20 shadow-polaroid hover:shadow-[0_28px_44px_-14px_rgba(28,31,23,0.45),0_10px_18px_-10px_rgba(28,31,23,0.3)] transition-shadow">
        <span className="tape left-1/2 -translate-x-1/2 -top-3" />

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
          {/* view cue */}
          <span className="absolute bottom-2 right-2 bg-ink text-paper font-display text-[0.65rem] uppercase tracking-[0.18em] px-3 py-1.5 rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity shadow-stamp-sm">
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
