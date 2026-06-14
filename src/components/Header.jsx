import { Link, useLocation } from "react-router-dom";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/inventory", label: "Inventory" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const location = useLocation();
  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="relative z-30 bg-paper">
      {/* top stripe — vintage marquee bar */}
      <div className="bg-forest-700 text-paper text-[0.68rem] tracking-[0.35em] uppercase font-medium">
        <div className="max-w-[1300px] mx-auto px-5 py-1.5 flex items-center justify-between gap-4">
          <span className="hidden sm:inline">Heber Springs · Rose Bud · Arkansas</span>
          <span className="flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-sun animate-pulse" />
            Open daily
          </span>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 pt-5 pb-4 flex items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3">
          {/* hand-drawn badge */}
          <span className="relative grid place-items-center size-12 sm:size-14 shrink-0 rounded-full bg-rust-500 text-paper rotate-[-6deg] ring-4 ring-paper shadow-[0_4px_0_0_rgba(28,31,23,0.85)] transition-transform group-hover:rotate-[-2deg]">
            <svg viewBox="0 0 40 40" className="w-6 sm:w-7 text-paper" aria-hidden>
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
            <span className="absolute -inset-1 rounded-full border border-dashed border-ink/40" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg sm:text-xl text-ink tracking-tight">
              Lake Area Rentals
            </span>
            <span className="font-hand text-rust-700 text-base sm:text-lg -mt-0.5">
              cars · rvs · sxs · trailers
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
                  ? "text-paper bg-forest-700 shadow-stamp-sm rotate-[-1deg]"
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
            className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper font-display text-xs uppercase tracking-[0.18em] rounded-[2px] shadow-stamp transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            Book a ride
            <span aria-hidden>→</span>
          </Link>
        </nav>

        {/* Mobile nav — vintage tabs */}
        <nav className="md:hidden flex items-center gap-1">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 font-display text-[0.7rem] tracking-widest uppercase ${
                isActive(to)
                  ? "text-paper bg-forest-700"
                  : "text-ink/80"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* hand-drawn scalloped divider */}
      <svg
        aria-hidden
        viewBox="0 0 1440 24"
        preserveAspectRatio="none"
        className="block w-full h-3 text-forest-700"
      >
        <path
          d="M0 12 Q 40 0 80 12 T 160 12 T 240 12 T 320 12 T 400 12 T 480 12 T 560 12 T 640 12 T 720 12 T 800 12 T 880 12 T 960 12 T 1040 12 T 1120 12 T 1200 12 T 1280 12 T 1360 12 T 1440 12 L 1440 24 L 0 24 Z"
          fill="currentColor"
        />
      </svg>
    </header>
  );
}
