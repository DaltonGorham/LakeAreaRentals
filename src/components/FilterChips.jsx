export default function FilterChips({ categories, selected, onSelect }) {
  return (
    <div className="filter-chips" role="tablist" aria-label="Filter by category">
      {categories.map((cat) => (
        <button
          key={cat.key}
          role="tab"
          aria-selected={selected === cat.key}
          className={`chip ${selected === cat.key ? 'active' : ''}`}
          onClick={() => onSelect(cat.key)}
        >
          {cat.label}
          {cat.count != null && <span className="chip-count">{cat.count}</span>}
        </button>
      ))}
    </div>
  );
}
