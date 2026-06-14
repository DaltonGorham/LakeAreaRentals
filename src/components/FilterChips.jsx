import { GridIcon } from './Icons';
import { CATEGORY_META } from './specs';

const ICONS = {
  all: GridIcon,
  car: CATEGORY_META.car.Icon,
  sxs: CATEGORY_META.sxs.Icon,
  rv: CATEGORY_META.rv.Icon,
  trailer: CATEGORY_META.trailer.Icon,
};

export default function FilterChips({ categories, selected, onSelect }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 sm:gap-3"
      role="tablist"
      aria-label="Filter by category"
    >
      {categories.map((cat) => {
        const Icon = ICONS[cat.key] || GridIcon;
        const active = selected === cat.key;
        return (
          <button
            key={cat.key}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(cat.key)}
            className={[
              'inline-flex items-center gap-2 px-4 py-2 font-display text-xs sm:text-sm uppercase tracking-[0.18em] rounded-[2px] transition-all',
              active
                ? 'bg-ink text-paper shadow-stamp-sm -rotate-[1deg]'
                : 'bg-cream text-ink border-2 border-ink/15 hover:border-rust-500 hover:text-rust-700',
            ].join(' ')}
          >
            <Icon className="text-base shrink-0" />
            <span>{cat.label}</span>
            {cat.count != null && (
              <span
                className={[
                  'ml-1 inline-grid place-items-center min-w-6 h-6 px-1.5 rounded-full text-[0.65rem] font-body font-semibold',
                  active ? 'bg-ochre-500 text-ink' : 'bg-ink/10 text-ink/80',
                ].join(' ')}
              >
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
