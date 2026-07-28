import { useState, useEffect } from 'react';
import FilterChips from './FilterChips';
import InventoryCard from './InventoryCard';
import { SearchIcon } from './Icons';
import { fetchAllItems } from '../lib/inventory';
import { fetchCurrentAndUpcomingRentals, getAvailability } from '../lib/rentals';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'car', label: 'Cars' },
  { key: 'sxs', label: 'SXS' },
  { key: 'rv', label: 'RVs' },
  { key: 'trailer', label: 'Trailers' },
];

export default function InventoryPage({ category, setCategory }) {
  const [items, setItems] = useState([]);
  const [rentalsByItem, setRentalsByItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([fetchAllItems(), fetchCurrentAndUpcomingRentals()])
      .then(([itemsData, rentalsData]) => {
        if (!active) return;
        setItems(itemsData);
        setRentalsByItem(rentalsData);
      })
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
    <main className="bg-paper text-ink min-h-screen pb-24">
      {/* ===================================================== HERO STRIPE */}
      <section className="paper-grain relative">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-10 pb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] uppercase leading-[0.95] tracking-tight">
              <span className="text-forest-700">The Full</span>{" "}
              <span className="italic font-editorial text-ink">inventory</span>
            </h1>
            <p className="mt-3 font-editorial italic text-ink-soft text-lg max-w-xl">
              Filter by category. Click any ride to see the spec sheet
            </p>
          </div>
        </div>

        {/* filter strip */}
        <div className="relative">
          <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
            <div className="bg-cream border-2 border-ink/15 rounded-md px-5 py-4 sm:px-6 sm:py-5 flex flex-wrap items-center gap-3">
              <span className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-ink-soft mr-1 sm:mr-2 shrink-0">
                Filter
              </span>
              <FilterChips categories={chips} selected={selected} onSelect={setCategory} />
            </div>
          </div>
        </div>

        <div className="h-[3px] bg-forest-700 mt-10" />
      </section>

      {/* ===================================================== RESULTS GRID */}
      <section className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-12">
        {loading ? (
          <EmptyState title="Loading the inventory…" caption="Pulling specs off the lot." />
        ) : error ? (
          <EmptyState
            title="Couldn't load the inventory"
            caption="Something stalled. Try again in a moment."
            action={
              <button
                onClick={() => window.location.reload()}
                className="bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-3 rounded-[2px] hover:bg-rust-700 transition-colors"
              >
                Retry
              </button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title="Nothing in this category yet"
            caption="Try another tag or take a look at the whole lot."
            action={
              <button
                onClick={() => setCategory('all')}
                className="bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-3 rounded-[2px] hover:bg-rust-700 transition-colors"
              >
                View all rides
              </button>
            }
          />
        ) : (
          <>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-ink-soft mb-6">
              Showing {visible.length} {visible.length === 1 ? 'ride' : 'rides'}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
              {visible.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  type={item.type}
                  availability={getAvailability(rentalsByItem[item.id])}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function EmptyState({ title, caption, action }) {
  return (
    <div className="bg-cream border-2 border-ink/15 rounded-md p-10 sm:p-14 text-center max-w-xl mx-auto">
      <SearchIcon className="mx-auto text-4xl text-rust-500 mb-4" />
      <h2 className="font-display text-2xl sm:text-3xl uppercase text-forest-700">{title}</h2>
      <p className="mt-2 font-editorial italic text-ink-soft">{caption}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
