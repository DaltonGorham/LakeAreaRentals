import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CarIcon,
  RvIcon,
  SxsIcon,
  TrailerIcon,
} from "./Icons";
import { fetchCategoryImages } from "../lib/inventory";
import { PLACEHOLDER_IMAGE } from "./specs";

const CAT_ICON_CLASS = "text-rust-500 text-2xl";

const CATEGORIES = [
  {
    label: "Cars",
    type: "car",
    tag: "errands & weekend escapes",
    icon: <CarIcon className={CAT_ICON_CLASS} />,
  },
  {
    label: "RVs",
    type: "rv",
    tag: "for the long haul",
    icon: <RvIcon className={CAT_ICON_CLASS} />,
  },
  {
    label: "SXS",
    type: "sxs",
    tag: "cruise the campground",
    icon: <SxsIcon className={CAT_ICON_CLASS} />,
  },
  {
    label: "Trailers",
    type: "trailer",
    tag: "haul anything",
    icon: <TrailerIcon className={CAT_ICON_CLASS} />,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [categoryImages, setCategoryImages] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoryImages()
      .then(setCategoryImages)
      .catch(() => {});
  }, []);

  return (
    <main className="bg-paper text-ink overflow-x-hidden">
      {/* =================================================================== HERO */}
      <section className="paper-grain relative">
        <div className="relative max-w-[1300px] mx-auto px-5 sm:px-10 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <h1 className="reveal font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.92] tracking-tight uppercase text-forest-700">
            Lake Area
            <span className="block text-ink italic font-editorial">Rentals</span>
          </h1>

          <p className="reveal mt-7 max-w-xl font-editorial italic text-xl sm:text-2xl leading-snug text-ink-soft">
            Cars, RVs, side-by-sides, and trailers
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/inventory")}
              className="group inline-flex items-center gap-3 bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-7 py-4 rounded-[2px] hover:bg-rust-700 transition-colors"
            >
              Browse the inventory
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ INVENTORY */}
      <section className="paper-grain relative py-24">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <h2 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95] text-forest-700">
                Straight
                <br />
                <span className="italic font-editorial text-ink">from the lot</span>
              </h2>
            </div>
            <button
              onClick={() => navigate("/inventory")}
              className="self-start sm:self-end inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-ink border-b-2 border-ink pb-1 hover:text-rust-700 hover:border-rust-500 transition-colors"
            >
              See everything
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map(({ label, type, tag, icon }) => (
              <button
                key={label}
                onClick={() => navigate("/inventory")}
                className="group relative text-left transition-transform hover:-translate-y-1"
              >
                <div className="bg-cream rounded-md overflow-hidden shadow-card">
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-shade">
                    <img
                      src={categoryImages[type] || PLACEHOLDER_IMAGE}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-lg text-ink leading-none flex items-center justify-between">
                      <span>{label}</span>
                      {icon}
                    </p>
                    <p className="font-editorial italic text-sm text-ink-soft mt-1.5">{tag}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ LOCATIONS */}
      <section className="paper-grain relative py-24">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="text-center mb-14">
            <h2 className="font-display text-5xl sm:text-7xl uppercase text-forest-700 leading-[0.95]">
              Two towns
              <br />
              <span className="italic font-editorial text-ink">One lake</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {[
              {
                town: "Heber Springs",
                address: "1819 AR-25, Heber Springs, AR 72543",
                src: "https://www.google.com/maps?q=1819+AR-25,+Heber+Springs,+AR+72543&output=embed",
              },
              {
                town: "Rose Bud",
                address: "110 Fisher Cook Rd, Rose Bud, AR 72137",
                src: "https://www.google.com/maps?q=110+Fisher+Cook+Rd,+Rose+Bud,+AR+72137&output=embed",
              },
            ].map(({ town, address, src }) => (
              <article
                key={town}
                className="relative bg-cream rounded-md p-5 shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-sm border-2 border-ink/10 bg-lake-300/30">
                  <iframe
                    title={`${town} Location`}
                    src={src}
                    loading="lazy"
                    allowFullScreen=""
                    className="w-full h-full grayscale-[0.2] sepia-[0.15]"
                  />
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-3xl uppercase text-forest-700 leading-none">
                      {town}
                    </h3>
                    <p className="mt-2 font-editorial italic text-ink-soft">{address}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-display text-xs uppercase tracking-[0.2em] text-ink border-b-2 border-ink pb-0.5 hover:text-rust-700 hover:border-rust-500"
                  >
                    Directions →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== CTA */}
      <section className="relative">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 pb-10">
          <div className="relative bg-rust-500 text-paper p-10 sm:p-14 rounded-md overflow-hidden">
            <div className="relative grid lg:grid-cols-12 items-center gap-8">
              <div className="lg:col-span-8">
                <h3 className="font-display text-4xl sm:text-6xl uppercase leading-[0.95]">
                  Got somewhere to be?
                  <br />
                  <span className="italic font-editorial text-paper/95">Let's get you in a rig</span>
                </h3>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <button
                  onClick={() => navigate("/inventory")}
                  className="bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-4 rounded-[2px] hover:bg-forest-700 transition-colors"
                >
                  See the inventory →
                </button>
                <a
                  href="tel:501-250-6398"
                  className="text-center bg-paper text-ink font-display uppercase tracking-[0.18em] text-sm px-6 py-4 rounded-[2px] hover:bg-cream transition-colors"
                >
                  Give us a call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
