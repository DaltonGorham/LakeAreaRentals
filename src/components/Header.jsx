import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, CloseIcon } from "./Icons";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/inventory", label: "Inventory" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="relative z-30 bg-paper">
      {/* top stripe */}
      <div className="bg-forest-700 text-paper text-[0.65rem] sm:text-[0.68rem] tracking-[0.25em] sm:tracking-[0.35em] uppercase font-medium">
        <div className="max-w-[1300px] mx-auto px-5 py-1.5 flex items-center justify-between gap-4">
          <span className="hidden sm:inline">Heber Springs · Rose Bud · Arkansas</span>
          <a href="tel:501-250-6398" className="hover:text-ochre-300 transition-colors">
            (501) 250-6398
          </a>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 pt-4 sm:pt-5 pb-4 flex items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="relative grid place-items-center size-10 sm:size-14 shrink-0 rounded-full bg-rust-500 text-paper">
            <svg viewBox="0 0 40 40" className="w-5 sm:w-7 text-paper" aria-hidden>
              <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="20" cy="20" r="6" fill="currentColor" stroke="none" />
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i * Math.PI) / 4;
                  const x1 = 20 + Math.cos(a) * 10;
                  const y1 = 20 + Math.sin(a) * 10;
                  const x2 = 20 + Math.cos(a) * 16;
                  const y2 = 20 + Math.sin(a) * 16;
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                })}
              </g>
            </svg>
          </span>
          <span className="flex flex-col leading-none min-w-0">
            <span className="font-display text-base sm:text-xl text-ink tracking-tight truncate">
              Lake Area Rentals
            </span>
            <span className="hidden sm:block font-body text-ink-soft text-xs sm:text-sm tracking-wide mt-1 truncate">
              Cars · RVs · SXS · Trailers
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-4 py-2 font-display text-sm tracking-wider uppercase transition-colors ${
                isActive(to)
                  ? "text-paper bg-forest-700"
                  : "text-ink hover:text-rust-700"
              }`}
            >
              {label}
              {!isActive(to) && (
                <span className="absolute left-4 right-4 bottom-1 h-[3px] bg-ochre-500 scale-x-0 origin-left transition-transform duration-300 hover:scale-x-100" />
              )}
            </Link>
          ))}
          <Link
            to="/inventory"
            className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper font-display text-xs uppercase tracking-[0.18em] rounded-[2px] hover:bg-rust-700 transition-colors"
          >
            Book a ride
            <span aria-hidden>→</span>
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="md:hidden grid place-items-center size-10 shrink-0 rounded-[2px] border-2 border-ink/15 text-ink hover:border-rust-500 hover:text-rust-700 transition-colors"
        >
          {menuOpen ? <CloseIcon className="text-xl" /> : <MenuIcon className="text-xl" />}
        </button>
      </div>

      <div className="h-[3px] bg-forest-700" />

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav className="md:hidden absolute inset-x-0 top-full bg-paper border-b-2 border-ink/15 shadow-card">
          <div className="max-w-[1300px] mx-auto px-5 py-4 flex flex-col gap-1">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-3 font-display text-sm tracking-wider uppercase rounded-[2px] transition-colors ${
                  isActive(to)
                    ? "text-paper bg-forest-700"
                    : "text-ink hover:bg-cream"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/inventory"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 bg-ink text-paper font-display text-sm uppercase tracking-[0.18em] rounded-[2px] hover:bg-rust-700 transition-colors"
            >
              Book a ride
              <span aria-hidden>→</span>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
