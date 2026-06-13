import { useState, useEffect } from 'react';
import FilterChips from './FilterChips';
import InventoryCard from './InventoryCard';
import { SearchIcon } from './Icons';
import { fetchAllItems } from '../lib/inventory';
import './InventoryPage.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'car', label: 'Cars' },
  { key: 'sxs', label: 'SXS' },
  { key: 'rv', label: 'RVs' },
  { key: 'trailer', label: 'Trailers' },
];

export default function InventoryPage({ category, setCategory }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchAllItems()
      .then((data) => active && setItems(data))
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const selected = category || 'all';

  const chips = CATEGORIES.map((c) => ({
    ...c,
    count: c.key === 'all' ? items.length : items.filter((i) => i.type === c.key).length,
  }));

  const visible = selected === 'all' ? items : items.filter((i) => i.type === selected);

  return (
    <main className="inventory">
      <div className="inventory-toolbar">
        <FilterChips categories={chips} selected={selected} onSelect={setCategory} />
      </div>

      {loading ? (
        <div className="inventory-empty">
          <p>Loading the fleet…</p>
        </div>
      ) : error ? (
        <div className="inventory-empty">
          <SearchIcon className="inventory-empty-icon" />
          <p>We couldn’t load the inventory. Please try again.</p>
          <button className="inventory-empty-reset" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : visible.length === 0 ? (
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
            <InventoryCard key={item.id} item={item} type={item.type} />
          ))}
        </div>
      )}
    </main>
  );
}
