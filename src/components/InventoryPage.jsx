import { useMemo } from 'react';
import FilterChips from './FilterChips';
import InventoryCard from './InventoryCard';
import cars from '../data/cars.json';
import sxs from '../data/sxs.json';
import rv from '../data/rv.json';
import trailers from '../data/trailers.json';
import './InventoryPage.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'car', label: 'Cars' },
  { key: 'sxs', label: 'SXS' },
  { key: 'rv', label: 'RVs' },
  { key: 'trailer', label: 'Trailers' },
];

export default function InventoryPage({ category, setCategory }) {
  const items = useMemo(
    () => [
      ...cars.map((c) => ({ ...c, _type: 'car' })),
      ...sxs.map((s) => ({ ...s, _type: 'sxs' })),
      ...rv.map((r) => ({ ...r, _type: 'rv' })),
      ...trailers.map((t) => ({ ...t, _type: 'trailer' })),
    ],
    []
  );

  const selected = category || 'all';

  const chips = CATEGORIES.map((c) => ({
    ...c,
    count: c.key === 'all' ? items.length : items.filter((i) => i._type === c.key).length,
  }));

  const visible = selected === 'all' ? items : items.filter((i) => i._type === selected);

  return (
    <main className="inventory">
      <div className="inventory-header">
        <h1>Inventory</h1>
        <FilterChips categories={chips} selected={selected} onSelect={setCategory} />
      </div>

      {visible.length === 0 ? (
        <p className="inventory-empty">Nothing in this category yet.</p>
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
