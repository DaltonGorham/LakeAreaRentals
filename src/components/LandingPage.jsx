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
    stamp: "01",
    tag: "errands & weekend escapes",
    copy: "Clean, comfortable rentals for grocery runs, road trips, and lake mornings.",
    icon: <CarIcon className={CAT_ICON_CLASS} />,
    rotate: "-rotate-2",
  },
  {
    label: "RVs",
    type: "rv",
    stamp: "02",
    tag: "for the long haul",
    copy: "Roomy motorhomes for family vacations and weeks-long stays on the water.",
    icon: <RvIcon className={CAT_ICON_CLASS} />,
    rotate: "rotate-1",
  },
  {
    label: "SXS",
    type: "sxs",
    stamp: "03",
    tag: "cruise the campground",
    copy: "Electric side-by-sides built for neighborhoods, lake roads, and cul-de-sacs.",
    icon: <SxsIcon className={CAT_ICON_CLASS} />,
    rotate: "-rotate-1",
  },
  {
    label: "Trailers",
    type: "trailer",
    stamp: "04",
    tag: "haul anything",
    copy: "Utility trailers ready for projects, equipment, gravel, and big-box hauls.",
    icon: <TrailerIcon className={CAT_ICON_CLASS} />,
    rotate: "rotate-2",
  },
];

const MARQUEE = [
  "Fishing trips",
  "Family road trips",
  "Project hauling",
  "Campground cruising",
  "Lake weekends",
  "Tailgates",
  "Move-in day",
  "Hardware runs",
];

const STATS = [
  { value: "2", label: "Local pickup points" },
  { value: "30+", label: "Rides on the lot" },
  { value: "365", label: "Days a year on call" },
  { value: "1", label: "Family running it" },
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
        {/* sun in the corner */}
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="absolute -top-10 -right-16 w-72 sm:w-96 text-ochre-500/60 animate-bob"
        >
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="100" cy="100" r="40" />
            <circle cx="100" cy="100" r="52" strokeDasharray="2 8" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6;
              const x1 = 100 + Math.cos(a) * 64;
              const y1 = 100 + Math.sin(a) * 64;
              const x2 = 100 + Math.cos(a) * 86;
              const y2 = 100 + Math.sin(a) * 86;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" />;
            })}
          </g>
        </svg>

        {/* lake ripples decoration */}
        <svg
          aria-hidden
          viewBox="0 0 600 200"
          className="absolute bottom-8 left-0 w-[44%] max-w-[520px] text-lake-500/35 animate-drift"
        >
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M0 30 Q 40 10 80 30 T 160 30 T 240 30 T 320 30 T 400 30 T 480 30 T 560 30" />
            <path d="M20 70 Q 60 50 100 70 T 180 70 T 260 70 T 340 70 T 420 70 T 500 70" />
            <path d="M0 110 Q 50 90 100 110 T 200 110 T 300 110 T 400 110 T 500 110" />
            <path d="M30 150 Q 70 130 110 150 T 190 150 T 270 150 T 350 150 T 430 150" />
          </g>
        </svg>

        <div className="relative max-w-[1300px] mx-auto px-5 sm:px-10 pt-12 pb-24 lg:pt-20 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT — title */}
          <div className="lg:col-span-7 relative z-10">
            <p className="reveal font-hand text-2xl sm:text-3xl text-rust-700 -rotate-2 inline-block mb-2">
              welcome to the lake —
            </p>
            <h1 className="reveal font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] tracking-tight uppercase">
              <span className="block text-forest-700">Lake</span>
              <span
                className="block text-paper -mt-2 sm:-mt-3"
                style={{
                  WebkitTextStroke: "2px var(--color-rust-700)",
                  textShadow: "5px 5px 0 var(--color-rust-500)",
                }}
              >
                Area
              </span>
              <span className="block text-ink -mt-2 sm:-mt-3 italic font-editorial">
                Rentals<span className="text-rust-500">.</span>
              </span>
            </h1>

            <p className="reveal mt-7 max-w-xl font-editorial italic text-xl sm:text-2xl leading-snug text-ink-soft">
              Cars, RVs, side-by-sides, and trailers —{" "}
              <span className="not-italic font-medium text-forest-700">
                for whatever brought you up here.
              </span>
            </p>

            <div className="reveal mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/inventory")}
                className="group inline-flex items-center gap-3 bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-7 py-4 rounded-[2px] shadow-stamp transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Browse the fleet
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
              <a
                href="tel:+15015550100"
                className="inline-flex items-center gap-2 font-display uppercase tracking-[0.18em] text-sm text-forest-700 border-b-2 border-dashed border-forest-500 pb-1 hover:text-rust-700 hover:border-rust-500 transition-colors"
              >
                or call the shop
              </a>
            </div>

            {/* hand-drawn caption */}
            <p className="reveal mt-6 font-hand text-xl text-lake-700 flex items-center gap-2">
              <svg viewBox="0 0 60 24" className="w-14 h-6 text-rust-500" aria-hidden>
                <path
                  d="M2 12 Q 20 2 40 12 T 58 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  markerEnd="url(#arr)"
                />
                <defs>
                  <marker id="arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0 0 L 10 5 L 0 10 Z" fill="currentColor" />
                  </marker>
                </defs>
              </svg>
              same-day pickup, most of the time
            </p>
          </div>

          {/* RIGHT — polaroid stack & vintage badge */}
          <div className="lg:col-span-5 relative h-[460px] sm:h-[520px] hidden lg:block">
            {/* vintage stamp badge */}
            <div className="absolute -top-2 -right-4 rotate-12 z-30">
              <div className="relative grid place-items-center size-44 rounded-full bg-rust-500 text-paper shadow-stamp">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-paper/80" />
                <div className="text-center leading-tight font-display">
                  <p className="text-[0.6rem] tracking-[0.3em]">— EST. —</p>
                  <p className="text-3xl my-1">A R</p>
                  <p className="text-[0.6rem] tracking-[0.3em]">GREERS FERRY</p>
                </div>
              </div>
            </div>

            {/* polaroid #1 */}
            <figure className="absolute top-8 left-2 w-60 -rotate-6 bg-cream p-3 pb-12 shadow-polaroid">
              <span className="tape left-1/2 -translate-x-1/2 -top-3" />
              <div className="aspect-[4/5] bg-lake-300 overflow-hidden">
                <img
                  src={categoryImages["rv"] || PLACEHOLDER_IMAGE}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="absolute bottom-2 left-0 right-0 text-center font-hand text-xl text-ink">
                rv #02
              </figcaption>
            </figure>

            {/* polaroid #2 */}
            <figure className="absolute top-24 right-0 w-56 rotate-3 bg-cream p-3 pb-12 shadow-polaroid">
              <span className="tape left-1/2 -translate-x-1/2 -top-3 !bg-rust-500/40" />
              <div className="aspect-[4/5] bg-forest-300 overflow-hidden">
                <img
                  src={categoryImages["sxs"] || PLACEHOLDER_IMAGE}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="absolute bottom-2 left-0 right-0 text-center font-hand text-xl text-ink">
                sxs ⚡
              </figcaption>
            </figure>

            {/* polaroid #3 */}
            <figure className="absolute bottom-2 left-12 w-52 -rotate-3 bg-cream p-3 pb-12 shadow-polaroid">
              <span className="tape left-1/2 -translate-x-1/2 -top-3 !bg-forest-500/50" />
              <div className="aspect-[4/5] bg-ochre-300 overflow-hidden">
                <img
                  src={categoryImages["car"] || PLACEHOLDER_IMAGE}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="absolute bottom-2 left-0 right-0 text-center font-hand text-xl text-ink">
                car #01
              </figcaption>
            </figure>
          </div>
        </div>

        {/* mobile polaroid preview */}
        <div className="lg:hidden relative h-72 mb-8 mx-5">
          <figure className="absolute left-2 top-0 w-48 -rotate-6 bg-cream p-3 pb-10 shadow-polaroid">
            <div className="aspect-[4/5] bg-lake-300 overflow-hidden">
              <img src={categoryImages["rv"] || PLACEHOLDER_IMAGE} alt="" className="w-full h-full object-cover" />
            </div>
            <figcaption className="absolute bottom-1.5 left-0 right-0 text-center font-hand text-lg">rv #02</figcaption>
          </figure>
          <figure className="absolute right-2 top-8 w-44 rotate-3 bg-cream p-3 pb-10 shadow-polaroid">
            <div className="aspect-[4/5] bg-forest-300 overflow-hidden">
              <img src={categoryImages["sxs"] || PLACEHOLDER_IMAGE} alt="" className="w-full h-full object-cover" />
            </div>
            <figcaption className="absolute bottom-1.5 left-0 right-0 text-center font-hand text-lg">sxs ⚡</figcaption>
          </figure>
        </div>
      </section>

      {/* ============================================================== MARQUEE */}
      <div className="bg-forest-700 text-paper py-4 border-y-2 border-ink overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-6 font-display text-lg tracking-[0.2em] uppercase"
            >
              {item}
              <span className="text-ochre-500 text-2xl leading-none">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ================================================================ FLEET */}
      <section className="paper-grain relative py-24">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="font-hand text-3xl text-rust-700 -rotate-2 inline-block mb-2">
                pick your ride —
              </p>
              <h2 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95] text-forest-700">
                Straight
                <br />
                <span className="italic font-editorial text-ink">from the lot.</span>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
            {CATEGORIES.map(({ label, type, stamp, tag, copy, icon, rotate }, i) => (
              <button
                key={label}
                onClick={() => navigate("/inventory")}
                className={`group relative text-left transition-transform hover:-translate-y-2 ${rotate} hover:rotate-0`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* polaroid frame */}
                <div className="bg-cream p-3 pb-16 shadow-polaroid relative">
                  <span className="tape left-1/2 -translate-x-1/2 -top-3" />
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-shade">
                    <img
                      src={categoryImages[type] || PLACEHOLDER_IMAGE}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* stamp number */}
                    <span className="absolute top-2 left-2 grid place-items-center size-12 rounded-full bg-paper text-ink font-display border-2 border-ink">
                      {stamp}
                    </span>
                  </div>
                  {/* caption */}
                  <figcaption className="absolute bottom-3 left-0 right-0 px-4">
                    <p className="font-hand text-2xl text-ink leading-none flex items-center justify-between">
                      <span>{label.toLowerCase()}</span>
                      {icon}
                    </p>
                    <p className="font-editorial italic text-sm text-ink-soft mt-1">{tag}</p>
                  </figcaption>
                </div>
                <p className="mt-4 px-1 text-sm text-ink-soft leading-relaxed font-body">{copy}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ STATS */}
      <section className="relative bg-forest-700 text-paper py-20 overflow-hidden">
        {/* sun-ray pattern */}
        <svg
          aria-hidden
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full text-paper/5"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <polygon
              key={i}
              points={`600,200 ${600 + Math.cos((i * Math.PI) / 12) * 1200},${
                200 + Math.sin((i * Math.PI) / 12) * 1200
              } ${600 + Math.cos(((i + 0.5) * Math.PI) / 12) * 1200},${
                200 + Math.sin(((i + 0.5) * Math.PI) / 12) * 1200
              }`}
              fill={i % 2 === 0 ? "currentColor" : "transparent"}
            />
          ))}
        </svg>

        <div className="relative max-w-[1300px] mx-auto px-5 sm:px-10 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center sm:text-left">
              <p className="font-display text-6xl sm:text-7xl text-ochre-300 leading-none">{value}</p>
              <p className="mt-3 font-editorial italic text-paper/85 max-w-[14ch] mx-auto sm:mx-0">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ LOCATIONS */}
      <section className="paper-grain relative py-24">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="text-center mb-14">
            <p className="font-hand text-3xl text-rust-700 inline-block -rotate-1">
              find us at the lake —
            </p>
            <h2 className="mt-2 font-display text-5xl sm:text-7xl uppercase text-forest-700 leading-[0.95]">
              Two towns.
              <br />
              <span className="italic font-editorial text-ink">One lake.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {[
              {
                town: "Heber Springs",
                address: "1819 AR-25, Heber Springs, AR 72543",
                stamp: "HS",
                rotate: "-rotate-1",
                tilt: "rotate-2",
                src: "https://www.google.com/maps?q=1819+AR-25,+Heber+Springs,+AR+72543&output=embed",
              },
              {
                town: "Rose Bud",
                address: "110 Fisher Cook Rd, Rose Bud, AR 72137",
                stamp: "RB",
                rotate: "rotate-1",
                tilt: "-rotate-2",
                src: "https://www.google.com/maps?q=110+Fisher+Cook+Rd,+Rose+Bud,+AR+72137&output=embed",
              },
            ].map(({ town, address, stamp, rotate, tilt, src }) => (
              <article
                key={town}
                className={`relative bg-cream p-5 shadow-polaroid transition-transform hover:-translate-y-1 ${rotate} hover:rotate-0`}
              >
                {/* postage stamp */}
                <div
                  className={`absolute -top-6 -right-4 z-10 ${tilt} bg-paper border-4 border-dashed border-rust-500 px-3 py-2 shadow-stamp-sm`}
                >
                  <p className="font-display text-2xl text-rust-700 leading-none">{stamp}</p>
                  <p className="font-hand text-rust-700 text-base leading-none mt-0.5">{town.split(" ")[0]}</p>
                </div>

                <div className="aspect-[16/10] overflow-hidden border-2 border-ink/10 bg-lake-300/30">
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
          <div className="relative bg-rust-500 text-paper p-10 sm:p-14 shadow-stamp overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full">
                <g fill="none" stroke="currentColor" strokeWidth="1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M0 ${20 * i} Q 100 ${20 * i - 8} 200 ${20 * i} T 400 ${20 * i} T 600 ${20 * i}`}
                    />
                  ))}
                </g>
              </svg>
            </div>
            <div className="relative grid lg:grid-cols-12 items-center gap-8">
              <div className="lg:col-span-8">
                <p className="font-hand text-2xl text-ochre-300 -rotate-1 inline-block">ready when you are —</p>
                <h3 className="font-display text-4xl sm:text-6xl uppercase leading-[0.95] mt-1">
                  Got somewhere to be?
                  <br />
                  <span className="italic font-editorial text-paper/95">Let's get you in a rig.</span>
                </h3>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <button
                  onClick={() => navigate("/inventory")}
                  className="bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-4 rounded-[2px] shadow-stamp-sm hover:-translate-y-0.5 transition-transform"
                >
                  See the fleet →
                </button>
                <a
                  href="tel:+15015550100"
                  className="text-center bg-paper text-ink font-display uppercase tracking-[0.18em] text-sm px-6 py-4 rounded-[2px] shadow-stamp-sm hover:-translate-y-0.5 transition-transform"
                >
                  Call the shop
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
