import { useState, useEffect } from 'react';
import FilterChips from './FilterChips';
import InventoryCard from './InventoryCard';
import { SearchIcon } from './Icons';
import { fetchAllItems } from '../lib/inventory';

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
    <main className="bg-paper text-ink min-h-screen pb-24">
      {/* ===================================================== HERO STRIPE */}
      <section className="paper-grain relative">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-10 pb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-hand text-2xl sm:text-3xl text-rust-700 -rotate-2 inline-block mb-1">
              every ride we've got —
            </p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] uppercase leading-[0.95] tracking-tight">
              <span className="text-forest-700">The Full</span>{" "}
              <span className="italic font-editorial text-ink">fleet.</span>
            </h1>
            <p className="mt-3 font-editorial italic text-ink-soft text-lg max-w-xl">
              Filter by category. Click any ride to see the spec sheet — call us to lock it in.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <p className="font-hand text-rust-700 text-xl">tap a tag below —</p>
            <svg viewBox="0 0 100 40" className="w-24 text-rust-500" aria-hidden>
              <path
                d="M5 8 Q 40 4 70 20 T 95 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd="url(#arr2)"
              />
              <defs>
                <marker id="arr2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0 0 L 10 5 L 0 10 Z" fill="currentColor" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        {/* filter strip on a paper bar */}
        <div className="relative">
          <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
            <div className="bg-cream border-2 border-ink/15 px-5 py-4 sm:px-6 sm:py-5 shadow-stamp-sm flex flex-wrap items-center gap-3">
              <span className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-ink-soft mr-1 sm:mr-2 shrink-0">
                Filter
              </span>
              <FilterChips categories={chips} selected={selected} onSelect={setCategory} />
            </div>
          </div>
        </div>

        {/* scalloped divider */}
        <svg
          aria-hidden
          viewBox="0 0 1440 24"
          preserveAspectRatio="none"
          className="block w-full h-3 mt-10 text-forest-700"
        >
          <path
            d="M0 12 Q 40 0 80 12 T 160 12 T 240 12 T 320 12 T 400 12 T 480 12 T 560 12 T 640 12 T 720 12 T 800 12 T 880 12 T 960 12 T 1040 12 T 1120 12 T 1200 12 T 1280 12 T 1360 12 T 1440 12 L 1440 24 L 0 24 Z"
            fill="currentColor"
          />
        </svg>
      </section>

      {/* ===================================================== RESULTS GRID */}
      <section className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-12">
        {loading ? (
          <EmptyState title="Loading the fleet…" caption="Pulling specs off the lot." />
        ) : error ? (
          <EmptyState
            title="Couldn't load the fleet"
            caption="Something stalled. Try again in a moment."
            action={
              <button
                onClick={() => window.location.reload()}
                className="bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-3 rounded-[2px] shadow-stamp-sm hover:-translate-y-0.5 transition-transform"
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
                className="bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-3 rounded-[2px] shadow-stamp-sm hover:-translate-y-0.5 transition-transform"
              >
                View all rides
              </button>
            }
          />
        ) : (
          <>
            <p className="font-hand text-xl text-forest-700 mb-6">
              showing {visible.length} {visible.length === 1 ? 'ride' : 'rides'}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
              {visible.map((item) => (
                <InventoryCard key={item.id} item={item} type={item.type} />
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
    <div className="bg-cream border-2 border-dashed border-ink/20 p-10 sm:p-14 text-center max-w-xl mx-auto">
      <SearchIcon className="mx-auto text-4xl text-rust-500 mb-4" />
      <h2 className="font-display text-2xl sm:text-3xl uppercase text-forest-700">{title}</h2>
      <p className="mt-2 font-editorial italic text-ink-soft">{caption}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
