import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PhoneIcon,
  MailIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  GridIcon,
} from './Icons';
import { CATEGORY_META, getFeatures, getHighlights, getImages, CONTACT } from './specs';
import { findItem } from '../data/inventory';
import './VehicleDetailPage.css';

function ContactCard({ label }) {
  return (
    <div className="vd-contact-card">
      <h2>Call or email for pricing</h2>
      <p>We will confirm availability, pricing, and reservation details for this {label || 'rental'}.</p>
      <a href={CONTACT.phoneHref} className="inv-btn inv-btn-primary inv-btn-lg vd-cta">
        <PhoneIcon /> Call {CONTACT.phone}
      </a>
      <a href={CONTACT.emailHref} className="inv-btn inv-btn-outline inv-btn-lg vd-cta">
        <MailIcon /> Email us
      </a>
      <p className="vd-contact-meta">{CONTACT.email}</p>
    </div>
  );
}

export default function VehicleDetailPage() {
  const { type, id } = useParams();
  const item = findItem(type, id);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const images = item ? getImages(item) : [];
  const total = images.length;
  const multiple = total > 1;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  const openLightbox = (i) => {
    setIndex(i);
    setLightbox(true);
  };

  useEffect(() => {
    if (item) document.title = `${item.name} — Lake Area Rentals`;
  }, [item]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false);
      else if (e.key === 'ArrowRight' && multiple) next();
      else if (e.key === 'ArrowLeft' && multiple) prev();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, multiple, next, prev]);

  if (!item) {
    return (
      <main className="vehicle-detail vd-missing">
        <h1>Vehicle not found</h1>
        <p>This listing may have been removed or the link is incorrect.</p>
        <Link to="/inventory" className="inv-btn inv-btn-primary inv-btn-lg">
          Browse the fleet
        </Link>
      </main>
    );
  }

  const meta = CATEGORY_META[type] || {};
  const MetaIcon = meta.Icon;
  const highlights = getHighlights(type, item);
  const features = getFeatures(type, item);
  const accentStyle = meta.accent
    ? { '--cat': `var(${meta.accent})`, '--cat-soft': `var(${meta.accentSoft})` }
    : {};

  const layoutClass = total === 1 ? 'single' : total === 2 ? 'duo' : 'trio';
  const previews = images.slice(0, 3);

  return (
    <main className="vehicle-detail" style={accentStyle}>
      <Link to="/inventory" className="vd-back">
        <ChevronLeftIcon /> Back to inventory
      </Link>

      {/* ---- Gallery (left) + contact (right) ---- */}
      <div className="vd-layout">
        <div className="vd-main">
          <section className={`vd-gallery ${layoutClass}`}>
            {previews.map((src, i) => (
              <button
                key={i}
                type="button"
                className={`vd-gallery-cell cell-${i}`}
                onClick={() => openLightbox(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt={`${item.name} — image ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
              </button>
            ))}
            {multiple && (
              <button type="button" className="vd-gallery-all" onClick={() => openLightbox(0)}>
                <GridIcon /> View {total} photos
              </button>
            )}
          </section>

          <header className="vd-head">
            <h1 className="vd-title">{item.name}</h1>
            <p className="vd-subtitle">
              {MetaIcon && <MetaIcon />}
              {meta.label}
            </p>
            {highlights.length > 0 && (
              <ul className="vd-pills">
                {highlights.map((h, i) => (
                  <li key={i}>
                    <h.Icon />
                    {h.text}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <div className="vd-contact-mobile">
            <ContactCard label={meta.label} />
          </div>

          {features.length > 0 && (
            <section className="vd-features-section">
              <h2>Additional features</h2>
              <ul className="vd-features">
                {features.map((feature, i) => (
                  <li key={i}>
                    <feature.Icon />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="vd-contact">
          <ContactCard label={meta.label} />
        </aside>
      </div>

      {/* ---- Photo lightbox ---- */}
      {lightbox && (
        <div
          className="vd-lightbox"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} photos`}
        >
          <button className="vd-lightbox-close" onClick={() => setLightbox(false)} aria-label="Close">
            <CloseIcon />
          </button>
          <div className="vd-lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <img src={images[index]} alt={`${item.name} — image ${index + 1} of ${total}`} />
            {multiple && (
              <>
                <button type="button" className="vd-lightbox-arrow prev" onClick={prev} aria-label="Previous image">
                  <ChevronLeftIcon />
                </button>
                <button type="button" className="vd-lightbox-arrow next" onClick={next} aria-label="Next image">
                  <ChevronRightIcon />
                </button>
                <span className="vd-lightbox-counter">
                  {index + 1} / {total}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
