import FilterChips from './FilterChips';
import InventoryCard from './InventoryCard';
import { SearchIcon } from './Icons';
import { ALL_ITEMS } from '../data/inventory';
import './InventoryPage.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'car', label: 'Cars' },
  { key: 'sxs', label: 'SXS' },
  { key: 'rv', label: 'RVs' },
  { key: 'trailer', label: 'Trailers' },
];

export default function InventoryPage({ category, setCategory }) {
  const items = ALL_ITEMS;

  const selected = category || 'all';

  const chips = CATEGORIES.map((c) => ({
    ...c,
    count: c.key === 'all' ? items.length : items.filter((i) => i._type === c.key).length,
  }));

  const visible = selected === 'all' ? items : items.filter((i) => i._type === selected);

  return (
    <main className="inventory">
      <div className="inventory-toolbar">
        <FilterChips categories={chips} selected={selected} onSelect={setCategory} />
      </div>

      {visible.length === 0 ? (
        <div className="inventory-empty">
          <SearchIcon className="inventory-empty-icon" />
          <p>Nothing in this category yet.</p>
          <button className="inventory-empty-reset" onClick={() => setCategory('all')}>
            View all vehicles
          </button>
        </div>
      ) : (
        <div className="inventory-grid">
          {visible.map((item) => (
            <InventoryCard key={`${item._type}-${item.id}`} item={item} type={item._type} />
          ))}
        </div>
      )}
    </main>
  );
}
