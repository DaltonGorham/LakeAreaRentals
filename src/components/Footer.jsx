import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 bg-forest-900 text-paper overflow-hidden">
      <div className="relative max-w-[1300px] mx-auto px-6 sm:px-10 pt-16 pb-12 grid gap-12 md:grid-cols-12">
        {/* brand block */}
        <div className="md:col-span-5">
          <h3 className="font-display text-4xl sm:text-5xl leading-[1] text-paper">
            Lake Area
            <br />
            <span className="text-rust-300">Rentals</span>
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

        {/* hours */}
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
                className="flex items-center justify-between py-2 border-b border-paper/15 last:border-0"
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
