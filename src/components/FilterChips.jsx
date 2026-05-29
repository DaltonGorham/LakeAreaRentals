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
    <div className="filter-chips" role="tablist" aria-label="Filter by category">
      {categories.map((cat) => {
        const Icon = ICONS[cat.key] || GridIcon;
        const active = selected === cat.key;
        return (
          <button
            key={cat.key}
            role="tab"
            aria-selected={active}
            className={`chip ${active ? 'active' : ''}`}
            data-cat={cat.key}
            onClick={() => onSelect(cat.key)}
          >
            <Icon className="chip-icon" />
            <span className="chip-label">{cat.label}</span>
            {cat.count != null && <span className="chip-count">{cat.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
