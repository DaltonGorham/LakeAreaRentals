import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 bg-forest-900 text-paper overflow-hidden">
      {/* hand-drawn scalloped top edge — meets the cream paper above */}
      <svg
        aria-hidden
        viewBox="0 0 1440 32"
        preserveAspectRatio="none"
        className="block w-full h-6 text-paper"
      >
        <path
          d="M0 0 Q 60 32 120 0 T 240 0 T 360 0 T 480 0 T 600 0 T 720 0 T 840 0 T 960 0 T 1080 0 T 1200 0 T 1320 0 T 1440 0 L 1440 0 L 0 0 Z"
          fill="currentColor"
        />
        <path
          d="M0 0 Q 60 32 120 0 T 240 0 T 360 0 T 480 0 T 600 0 T 720 0 T 840 0 T 960 0 T 1080 0 T 1200 0 T 1320 0 T 1440 0"
          fill="currentColor"
        />
      </svg>

      {/* silhouette pines + cabin */}
      <svg
        aria-hidden
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute top-6 left-0 right-0 w-full h-32 text-forest-700"
      >
        <g fill="currentColor" opacity="0.5">
          <polygon points="40,140 60,80 80,140" />
          <polygon points="90,140 115,60 140,140" />
          <polygon points="160,140 180,90 200,140" />
          <polygon points="1240,140 1265,70 1290,140" />
          <polygon points="1300,140 1320,90 1340,140" />
          <polygon points="1360,140 1385,60 1410,140" />
          {/* cabin */}
          <rect x="660" y="92" width="120" height="48" />
          <polygon points="650,92 720,55 790,92" />
          <rect x="710" y="108" width="20" height="32" fill="#f0b740" />
        </g>
      </svg>

      <div className="relative max-w-[1300px] mx-auto px-6 sm:px-10 pt-36 pb-12 grid gap-12 md:grid-cols-12">
        {/* brand block */}
        <div className="md:col-span-5">
          <p className="font-hand text-ochre-300 text-3xl leading-none">see you at the lake</p>
          <h3 className="font-display text-4xl sm:text-5xl mt-2 leading-[1] text-paper">
            Lake Area
            <br />
            <span className="text-rust-300">Rentals.</span>
          </h3>
        </div>

        {/* links */}
        <div className="md:col-span-3">
          <h4 className="font-display text-sm tracking-[0.3em] uppercase text-ochre-300 mb-4">
            Quick Stops
          </h4>
          <ul className="space-y-2.5 font-body">
            {[
              ["Inventory", "/inventory"],
              ["About Us", "/about"],
              ["Rental Agreement", "/rental-agreement"],
              ["Privacy Policy", "/privacy-policy"],
            ].map(([label, to]) => (
              <li key={to}>
                <button
                  onClick={() => navigate(to)}
                  className="group inline-flex items-center gap-2 text-paper/90 hover:text-paper transition-colors"
                >
                  <span className="text-rust-300 transition-transform group-hover:translate-x-1">›</span>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* hours — chalkboard style */}
        <div className="md:col-span-4">
          <h4 className="font-display text-sm tracking-[0.3em] uppercase text-ochre-300 mb-4">
            Open Hours
          </h4>
          <div className="relative rounded-[3px] bg-forest-700/60 ring-1 ring-paper/15 p-5 font-editorial">
            {[
              ["Mon – Fri", "8 AM – 6 PM"],
              ["Saturday", "9 AM – 6 PM"],
              ["Sunday", "10 AM – 6 PM"],
            ].map(([day, hours]) => (
              <div
                key={day}
                className="flex items-center justify-between py-2 border-b border-dashed border-paper/15 last:border-0"
              >
                <span className="text-paper/80">{day}</span>
                <span className="text-ochre-300 font-medium">{hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* bottom stripe */}
      <div className="relative border-t border-paper/15">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-paper/70 text-sm">
          <p className="font-body">
            © {year} Lake Area Rentals LLC · Heber Springs &amp; Rose Bud, AR
          </p>
          <button
            onClick={() => navigate("/privacy-policy")}
            className="font-display text-xs tracking-[0.25em] uppercase hover:text-paper transition-colors"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </footer>
  );
}
