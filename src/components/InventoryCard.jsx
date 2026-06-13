import { CATEGORY_META, getHighlights, getImages } from './specs';
import { vehicleHref } from '../lib/inventory';
import './Cards.css';

export default function InventoryCard({ item, type }) {
  const meta = CATEGORY_META[type] || {};
  const images = getImages(item);
  const highlights = getHighlights(type, item);
  const accentStyle = meta.accent
    ? { '--cat': `var(${meta.accent})`, '--cat-soft': `var(${meta.accentSoft})` }
    : {};

  return (
    <a
      className="inv-card"
      style={accentStyle}
      href={vehicleHref(type, item.id)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="inv-card-media">
        <img src={images[0]} alt={item.name} loading="lazy" />
        <span className="inv-card-cue">View details</span>
      </div>

      <div className="inv-card-body">
        <h3 className="inv-card-name">{item.name}</h3>
        {highlights.length > 0 && (
          <ul className="inv-card-highlights">
            {highlights.map((h, i) => (
              <li key={i}>
                <h.Icon />
                {h.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </a>
  );
}
