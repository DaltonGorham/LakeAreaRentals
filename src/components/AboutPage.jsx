import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CarIcon, CheckIcon, GridIcon, MailIcon, PhoneIcon } from "./Icons";
import { fetchCategoryImages } from "../lib/inventory";
import { PLACEHOLDER_IMAGE } from "./specs";

const BENEFIT_ICON_CLASS = "shrink-0 text-3xl sm:text-4xl text-ochre-500/70";

const BENEFITS = [
  {
    icon: <CarIcon className={BENEFIT_ICON_CLASS} />,
    title: "Practical rentals, real local needs",
    copy: "Cars, RVs, side-by-sides, and trailers picked for lake weekends, family travel, errands, and hauling.",
  },
  {
    icon: <PhoneIcon className={BENEFIT_ICON_CLASS} />,
    title: "Talk to a real local team",
    copy: "Call or email to lock in availability, pricing, pickup details, and anything specific you need.",
  },
  {
    icon: <CheckIcon className={BENEFIT_ICON_CLASS} />,
    title: "Paperwork done early",
    copy: "Sign the rental agreement ahead of time so pickup is faster and nothing is left guessing.",
  },
  {
    icon: <GridIcon className={BENEFIT_ICON_CLASS} />,
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
      copy: "Browse the inventory and pick the car, RV, side-by-side, or trailer that fits your plans.",
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
            <h1 className="reveal font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] uppercase tracking-tight">
              <span className="block text-forest-700">How rentals</span>
              <span className="block italic font-editorial text-ink -mt-1">work here</span>
            </h1>
            <p className="reveal mt-6 max-w-xl font-editorial italic text-xl sm:text-2xl leading-snug text-ink-soft">
              Browse what's available, call or email for current pricing, and turn in the rental
              form before pickup
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-4">
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-3.5 rounded-[2px] hover:bg-rust-700 transition-colors"
              >
                View inventory →
              </Link>
              <a
                href="tel:501-250-6398"
                className="inline-flex items-center gap-2 font-display uppercase tracking-[0.18em] text-sm text-forest-700 border-b-2 border-forest-500 pb-1 hover:text-rust-700 hover:border-rust-500 transition-colors"
              >
                Call now
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="w-full max-w-[420px] mx-auto rounded-md overflow-hidden shadow-card aspect-[4/5]">
              <img
                src={introImage}
                alt="Lake Area Rentals vehicle ready for pickup"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================= BENEFITS */}
      <section className="paper-grain relative py-20">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <h2 className="font-display text-5xl sm:text-6xl uppercase leading-[0.95] text-forest-700">
                Reasons to roll
                <br />
                <span className="italic font-editorial text-ink">with us</span>
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
            {BENEFITS.map(({ icon, title, copy }) => (
              <article
                key={title}
                className="relative bg-cream p-7 sm:p-8 rounded-md border-2 border-ink/10 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-forest-700 uppercase leading-tight">
                      {title}
                    </h3>
                    <p className="mt-2 font-editorial italic text-ink-soft leading-snug">{copy}</p>
                  </div>
                  {icon}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ STEPS */}
      <section className="relative bg-forest-700 text-paper py-24">
        <div className="relative max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95]">
              How to book
              <br />
              <span className="italic font-editorial text-ochre-300">a rental</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6 lg:gap-10">
            {steps.map(({ title, image }, index) => (
              <article key={title} className="relative">
                <div className="relative bg-cream text-ink rounded-md overflow-hidden shadow-card">
                  <div className="aspect-[5/4] overflow-hidden bg-paper-shade">
                    <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute top-3 left-3 grid place-items-center size-9 rounded-full bg-rust-500 text-paper font-display text-sm">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl uppercase text-paper leading-tight">
                  {title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= CONTACT */}
      <section className="paper-grain py-20">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="relative bg-cream border-2 border-ink/15 rounded-md p-8 sm:p-12 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display text-4xl sm:text-5xl uppercase leading-[0.95] text-forest-700">
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
                className="flex items-center justify-between gap-4 bg-rust-500 text-paper px-5 py-4 rounded-[2px] font-display uppercase tracking-[0.18em] text-sm hover:bg-rust-700 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <PhoneIcon className="text-xl" /> (501) 250-6398
                </span>
                <span aria-hidden>→</span>
              </a>
              <a
                href="mailto:info@lakearearentalsllc.com"
                className="flex items-center justify-between gap-4 bg-forest-700 text-paper px-5 py-4 rounded-[2px] font-display uppercase tracking-[0.18em] text-sm hover:bg-forest-900 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <MailIcon className="text-xl" /> Email us
                </span>
                <span aria-hidden>→</span>
              </a>
              <Link
                to="/rental-agreement"
                className="flex items-center justify-between gap-4 bg-ink text-paper px-5 py-4 rounded-[2px] font-display uppercase tracking-[0.18em] text-sm hover:bg-rust-700 transition-colors"
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
