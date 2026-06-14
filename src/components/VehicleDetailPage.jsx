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
import { fetchItem } from '../lib/inventory';

function ContactCard({ label }) {
  return (
    <div className="relative bg-cream border-2 border-ink/15 shadow-stamp p-6 sm:p-7">
      {/* postage stamp corner */}
      <div className="absolute -top-5 -right-4 rotate-12 bg-paper border-4 border-dashed border-rust-500 px-3 py-2 shadow-stamp-sm">
        <p className="font-display text-base text-rust-700 leading-none">CALL</p>
        <p className="font-hand text-rust-700 text-sm leading-none mt-0.5">us</p>
      </div>

      <p className="font-hand text-2xl text-rust-700 -rotate-1 inline-block leading-none">
        ready to book —
      </p>
      <h2 className="mt-1 font-display text-2xl sm:text-3xl uppercase text-forest-700 leading-[0.95]">
        Call or email
        <br />
        <span className="italic font-editorial text-ink">for pricing.</span>
      </h2>
      <p className="mt-3 font-editorial italic text-ink-soft leading-snug">
        We'll confirm availability, pricing, and reservation details for this{' '}
        {label || 'rental'}.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <a
          href={CONTACT.phoneHref}
          className="flex items-center justify-between gap-3 bg-rust-500 text-paper px-5 py-3.5 shadow-stamp-sm font-display uppercase tracking-[0.18em] text-sm hover:-translate-y-0.5 transition-transform"
        >
          <span className="flex items-center gap-3">
            <PhoneIcon className="text-lg" /> {CONTACT.phone}
          </span>
          <span aria-hidden>→</span>
        </a>
        <a
          href={CONTACT.emailHref}
          className="flex items-center justify-between gap-3 bg-forest-700 text-paper px-5 py-3.5 shadow-stamp-sm font-display uppercase tracking-[0.18em] text-sm hover:-translate-y-0.5 transition-transform"
        >
          <span className="flex items-center gap-3">
            <MailIcon className="text-lg" /> Email us
          </span>
          <span aria-hidden>→</span>
        </a>
      </div>

      <p className="mt-4 pt-4 border-t border-dashed border-ink/15 font-editorial italic text-sm text-ink-soft break-all">
        {CONTACT.email}
      </p>
    </div>
  );
}

export default function VehicleDetailPage() {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchItem(id)
      .then((data) => active && setItem(data))
      .catch(() => active && setItem(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

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

  if (loading) {
    return (
      <main className="bg-paper text-ink min-h-screen paper-grain grid place-items-center">
        <p className="font-editorial italic text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="bg-paper text-ink min-h-screen paper-grain grid place-items-center px-5">
        <div className="bg-cream border-2 border-dashed border-ink/20 p-10 sm:p-14 text-center max-w-xl">
          <p className="font-hand text-2xl text-rust-700 -rotate-1 inline-block">
            uh-oh —
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl uppercase text-forest-700 leading-[0.95]">
            Vehicle not
            <br />
            <span className="italic font-editorial text-ink">found.</span>
          </h1>
          <p className="mt-3 font-editorial italic text-ink-soft">
            This listing may have been removed or the link is incorrect.
          </p>
          <Link
            to="/inventory"
            className="mt-6 inline-flex items-center gap-2 bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-3 rounded-[2px] shadow-stamp-sm hover:-translate-y-0.5 transition-transform"
          >
            Browse the inventory
            <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    );
  }

  const meta = CATEGORY_META[type] || {};
  const MetaIcon = meta.Icon;
  const highlights = getHighlights(type, item);
  const features = getFeatures(type, item);

  const previews = images.slice(0, 3);
  const galleryClass =
    total === 1
      ? 'grid-cols-1'
      : total === 2
      ? 'grid-cols-2'
      : 'grid-cols-3';

  return (
    <main className="bg-paper text-ink min-h-screen paper-grain pb-16">
      <div className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-8">
        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.25em] text-ink-soft hover:text-rust-700 transition-colors"
        >
          <ChevronLeftIcon /> Back to inventory
        </Link>
      </div>

      <div className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-6 grid lg:grid-cols-12 gap-8">
        {/* LEFT — main content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery */}
          <section
            className={`relative bg-cream p-3 sm:p-4 shadow-polaroid grid gap-2 sm:gap-3 ${galleryClass}`}
          >
            <span className="tape left-1/2 -translate-x-1/2 -top-3" />
            {previews.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(i)}
                aria-label={`View image ${i + 1}`}
                className={`group relative overflow-hidden bg-paper-shade ${
                  total >= 3 && i === 0 ? 'row-span-2 col-span-2' : ''
                } ${total === 1 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}
              >
                <img
                  src={src}
                  alt={`${item.name} — image ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
            {multiple && (
              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="absolute bottom-5 right-5 inline-flex items-center gap-2 bg-ink text-paper font-display uppercase tracking-[0.18em] text-xs px-4 py-2.5 rounded-[2px] shadow-stamp-sm hover:-translate-y-0.5 transition-transform"
              >
                <GridIcon /> View {total} photos
              </button>
            )}
          </section>

          {/* Header */}
          <header>
            <p className="font-hand text-2xl text-rust-700 -rotate-2 inline-block leading-none">
              {meta.label || 'rental'} —
            </p>
            <h1 className="mt-1 font-display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95] tracking-tight">
              <span className="text-forest-700">{item.name}</span>
              <span className="text-rust-500">.</span>
            </h1>
            {meta.label && (
              <p className="mt-2 inline-flex items-center gap-2 font-display text-[0.7rem] uppercase tracking-[0.25em] text-ink-soft">
                {MetaIcon && <MetaIcon className="text-base text-rust-500" />}
                {meta.label}
              </p>
            )}

            {highlights.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                  <li
                    key={i}
                    className="inline-flex items-center gap-2 bg-cream border-2 border-ink/15 px-3.5 py-1.5 rounded-[2px] font-editorial italic text-ink shadow-stamp-sm"
                  >
                    <h.Icon className="text-rust-500 not-italic text-base" />
                    {h.text}
                  </li>
                ))}
              </ul>
            )}
          </header>

          {/* Mobile contact (sidebar appears on lg+) */}
          <div className="lg:hidden">
            <ContactCard label={meta.label} />
          </div>

          {/* Features */}
          {features.length > 0 && (
            <section className="bg-cream border-2 border-ink/15 shadow-stamp-sm p-6 sm:p-8">
              <p className="font-hand text-xl text-rust-700 -rotate-1 inline-block leading-none">
                what's onboard —
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl uppercase text-forest-700 leading-tight">
                Additional features
              </h2>

              <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-2 border-b border-dashed border-ink/15 last:border-0"
                  >
                    <span className="shrink-0 mt-0.5 grid place-items-center size-6 rounded-full bg-forest-700 text-paper">
                      <feature.Icon className="text-xs" />
                    </span>
                    <span className="font-body text-ink leading-snug">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT — sticky contact */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="lg:sticky lg:top-8">
            <ContactCard label={meta.label} />
          </div>
        </aside>
      </div>

      {/* ============================================================ LIGHTBOX */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} photos`}
          className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm grid place-items-center p-5"
        >
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute top-5 right-5 grid place-items-center size-11 rounded-full bg-paper text-ink hover:bg-rust-500 hover:text-paper transition-colors shadow-stamp-sm"
          >
            <CloseIcon className="text-xl" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[min(1100px,95vw)] max-h-[88vh] bg-cream p-3 shadow-polaroid"
          >
            <span className="tape left-1/2 -translate-x-1/2 -top-3" />
            <img
              src={images[index]}
              alt={`${item.name} — image ${index + 1} of ${total}`}
              className="block max-w-full max-h-[80vh] object-contain"
            />
            {multiple && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute top-1/2 -translate-y-1/2 left-2 sm:-left-6 grid place-items-center size-12 rounded-full bg-paper text-ink hover:bg-rust-500 hover:text-paper transition-colors shadow-stamp-sm"
                >
                  <ChevronLeftIcon className="text-xl" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="absolute top-1/2 -translate-y-1/2 right-2 sm:-right-6 grid place-items-center size-12 rounded-full bg-paper text-ink hover:bg-rust-500 hover:text-paper transition-colors shadow-stamp-sm"
                >
                  <ChevronRightIcon className="text-xl" />
                </button>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-ink text-paper font-display text-xs uppercase tracking-[0.2em] px-3 py-1.5 rounded-[2px] shadow-stamp-sm">
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
