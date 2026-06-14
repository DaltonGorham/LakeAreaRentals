import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CarIcon, CheckIcon, GridIcon, MailIcon, PhoneIcon } from "./Icons";
import { fetchCategoryImages } from "../lib/inventory";
import { PLACEHOLDER_IMAGE } from "./specs";

const BENEFIT_ICON_CLASS = "absolute bottom-5 right-5 text-4xl text-ochre-500/70";

const BENEFITS = [
  {
    icon: <CarIcon className={BENEFIT_ICON_CLASS} />,
    stamp: "01",
    title: "Practical rentals, real local needs",
    copy: "Cars, RVs, side-by-sides, and trailers picked for lake weekends, family travel, errands, and hauling.",
  },
  {
    icon: <PhoneIcon className={BENEFIT_ICON_CLASS} />,
    stamp: "02",
    title: "Talk to a real local team",
    copy: "Call or email to lock in availability, pricing, pickup details, and anything specific you need.",
  },
  {
    icon: <CheckIcon className={BENEFIT_ICON_CLASS} />,
    stamp: "03",
    title: "Paperwork done early",
    copy: "Sign the rental agreement ahead of time so pickup is faster and nothing is left guessing.",
  },
  {
    icon: <GridIcon className={BENEFIT_ICON_CLASS} />,
    stamp: "04",
    title: "Works with most insurers",
    copy: "If your rental ties to an insurance claim, we'll help coordinate the details with most agencies.",
  },
];

export default function AboutPage() {
  const [categoryImages, setCategoryImages] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoryImages()
      .then(setCategoryImages)
      .catch(() => {});
  }, []);

  const introImage =
    categoryImages.car ||
    categoryImages.sxs ||
    categoryImages.rv ||
    categoryImages.trailer ||
    PLACEHOLDER_IMAGE;

  const steps = [
    {
      title: "Find the right rental",
      copy: "Browse the fleet and pick the car, RV, side-by-side, or trailer that fits your plans.",
      image: categoryImages.car || PLACEHOLDER_IMAGE,
      tag: "step one",
    },
    {
      title: "Call or email for pricing",
      copy: "We confirm availability, pricing, pickup timing, and rental requirements directly.",
      image: categoryImages.sxs || PLACEHOLDER_IMAGE,
      tag: "step two",
    },
    {
      title: "Fill out the rental form",
      copy: "Submit the rental agreement before pickup so everything is ready when you arrive.",
      image: categoryImages.trailer || PLACEHOLDER_IMAGE,
      tag: "step three",
    },
  ];

  return (
    <main className="bg-paper text-ink overflow-x-hidden">
      {/* ============================================================ HERO */}
      <section className="paper-grain relative">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-12 pb-20 lg:pt-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative z-10">
            <p className="reveal font-hand text-2xl sm:text-3xl text-rust-700 -rotate-2 inline-block mb-2">
              about the shop —
            </p>
            <h1 className="reveal font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] uppercase tracking-tight">
              <span className="block text-forest-700">How rentals</span>
              <span className="block italic font-editorial text-ink -mt-1">work here.</span>
            </h1>
            <p className="reveal mt-6 max-w-xl font-editorial italic text-xl sm:text-2xl leading-snug text-ink-soft">
              Browse what's available, call or email for current pricing, and turn in the rental
              form before pickup —{" "}
              <span className="not-italic font-medium text-forest-700">
                that's the whole drill.
              </span>
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-4">
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-3.5 rounded-[2px] shadow-stamp hover:-translate-y-0.5 transition-transform"
              >
                View inventory →
              </Link>
              <a
                href="tel:501-250-6398"
                className="inline-flex items-center gap-2 font-display uppercase tracking-[0.18em] text-sm text-forest-700 border-b-2 border-dashed border-forest-500 pb-1 hover:text-rust-700 hover:border-rust-500 transition-colors"
              >
                Call now
              </a>
            </div>
          </div>

          {/* Polaroid intro */}
          <div className="lg:col-span-5 relative">
            <figure className="relative w-full max-w-[420px] mx-auto -rotate-2 bg-cream p-4 pb-14 shadow-polaroid">
              <span className="tape left-1/2 -translate-x-1/2 -top-3" />
              <div className="aspect-[4/5] overflow-hidden bg-paper-shade">
                <img
                  src={introImage}
                  alt="Lake Area Rentals vehicle ready for pickup"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="absolute bottom-3 left-0 right-0 text-center font-hand text-2xl text-ink">
                ready for pickup
              </figcaption>
              {/* postage stamp */}
              <div className="absolute -top-5 -right-5 rotate-12 bg-paper border-4 border-dashed border-rust-500 px-3 py-2 shadow-stamp-sm">
                <p className="font-display text-lg text-rust-700 leading-none">EST.</p>
                <p className="font-hand text-rust-700 text-sm leading-none mt-0.5">A R K</p>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ======================================================= BENEFITS */}
      <section className="paper-grain relative py-20">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="font-hand text-3xl text-rust-700 -rotate-2 inline-block mb-1">
                why folks come back —
              </p>
              <h2 className="font-display text-5xl sm:text-6xl uppercase leading-[0.95] text-forest-700">
                Reasons to roll
                <br />
                <span className="italic font-editorial text-ink">with us.</span>
              </h2>
            </div>
            <Link
              to="/inventory"
              className="self-start sm:self-end inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-ink border-b-2 border-ink pb-1 hover:text-rust-700 hover:border-rust-500 transition-colors"
            >
              Find a rental →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {BENEFITS.map(({ icon, stamp, title, copy }, i) => (
              <article
                key={title}
                className={`relative bg-cream p-7 sm:p-8 shadow-stamp-sm border-2 border-ink/10 ${
                  i % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"
                } transition-transform hover:rotate-0 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-5">
                  {/* stamp circle */}
                  <span className="shrink-0 relative grid place-items-center size-16 rounded-full bg-rust-500 text-paper font-display text-2xl shadow-stamp-sm">
                    {stamp}
                    <span className="absolute inset-1.5 rounded-full border border-dashed border-paper/70" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-forest-700 uppercase leading-tight">
                      {title}
                    </h3>
                    <p className="mt-3 font-editorial text-ink-soft leading-relaxed">{copy}</p>
                  </div>
                </div>
                {icon}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ STEPS */}
      <section className="relative bg-forest-700 text-paper py-24 overflow-hidden">
        {/* subtle ripples */}
        <svg
          aria-hidden
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 w-full h-32 text-paper/10"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M0 50 Q 100 30 200 50 T 400 50 T 600 50 T 800 50 T 1000 50 T 1200 50" />
            <path d="M0 100 Q 100 80 200 100 T 400 100 T 600 100 T 800 100 T 1000 100 T 1200 100" />
            <path d="M0 150 Q 100 130 200 150 T 400 150 T 600 150 T 800 150 T 1000 150 T 1200 150" />
          </g>
        </svg>

        <div className="relative max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="text-center mb-16">
            <p className="font-hand text-3xl text-ochre-300 -rotate-1 inline-block">three steps —</p>
            <h2 className="mt-2 font-display text-5xl sm:text-7xl uppercase leading-[0.95]">
              How to book
              <br />
              <span className="italic font-editorial text-ochre-300">a rental.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6 lg:gap-10 relative">
            {/* hand-drawn connector line (desktop) */}
            <svg
              aria-hidden
              viewBox="0 0 1000 80"
              preserveAspectRatio="none"
              className="hidden md:block absolute inset-x-0 top-32 w-full h-16 text-ochre-300/60 pointer-events-none"
            >
              <path
                d="M100 40 Q 250 0 500 40 T 900 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />
            </svg>

            {steps.map(({ title, copy, image, tag }, index) => (
              <article
                key={title}
                className={`relative ${index === 1 ? "md:translate-y-6" : ""}`}
              >
                <div
                  className={`relative bg-cream text-ink p-3 pb-14 shadow-polaroid ${
                    index % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                >
                  <span className="tape left-1/2 -translate-x-1/2 -top-3" />
                  <div className="aspect-[5/4] overflow-hidden bg-paper-shade">
                    <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="absolute bottom-3 left-0 right-0 text-center font-hand text-2xl text-ink leading-none">
                    {tag}
                  </figcaption>
                  {/* stamp number */}
                  <span className="absolute -top-5 -left-3 grid place-items-center size-14 rounded-full bg-rust-500 text-paper font-display text-xl border-4 border-paper rotate-[-8deg] shadow-stamp-sm">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl uppercase text-paper leading-tight">
                  {title}
                </h3>
                <p className="mt-2 font-editorial text-paper/85 leading-relaxed">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= CONTACT */}
      <section className="paper-grain py-20">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="relative bg-cream border-2 border-ink/15 p-8 sm:p-12 shadow-stamp grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <p className="font-hand text-2xl text-rust-700 -rotate-1 inline-block">
                got a date in mind?
              </p>
              <h2 className="mt-1 font-display text-4xl sm:text-5xl uppercase leading-[0.95] text-forest-700">
                Ready to check
                <br />
                <span className="italic font-editorial text-ink">availability?</span>
              </h2>
              <p className="mt-4 font-editorial italic text-ink-soft text-lg max-w-md">
                Call or email for pricing, pickup details, and rental requirements.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3">
              <a
                href="tel:501-250-6398"
                className="flex items-center justify-between gap-4 bg-rust-500 text-paper px-5 py-4 shadow-stamp-sm font-display uppercase tracking-[0.18em] text-sm hover:-translate-y-0.5 transition-transform"
              >
                <span className="flex items-center gap-3">
                  <PhoneIcon className="text-xl" /> (501) 250-6398
                </span>
                <span aria-hidden>→</span>
              </a>
              <a
                href="mailto:info@lakearearentalsllc.com"
                className="flex items-center justify-between gap-4 bg-forest-700 text-paper px-5 py-4 shadow-stamp-sm font-display uppercase tracking-[0.18em] text-sm hover:-translate-y-0.5 transition-transform"
              >
                <span className="flex items-center gap-3">
                  <MailIcon className="text-xl" /> Email us
                </span>
                <span aria-hidden>→</span>
              </a>
              <Link
                to="/rental-agreement"
                className="flex items-center justify-between gap-4 bg-ink text-paper px-5 py-4 shadow-stamp-sm font-display uppercase tracking-[0.18em] text-sm hover:-translate-y-0.5 transition-transform"
              >
                <span className="flex items-center gap-3">
                  <GridIcon className="text-xl" /> Rental form
                </span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
