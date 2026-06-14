import { useEffect } from "react";

const LAST_UPDATED = "May 29, 2026";

const SECTIONS = [
  {
    id: "information-we-collect",
    label: "Information we collect",
    body: (
      <>
        <p>We only collect information you choose to share with us, including:</p>
        <ul>
          <li>Contact details you provide by phone, email, or our rental agreement form, such as your name, phone number, and email address.</li>
          <li>Rental and driver information you submit to complete a reservation, such as driver's license details, requested dates, and vehicle interest.</li>
          <li>Basic technical data your browser sends automatically, such as IP address, device type, pages viewed, and standard server log information.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    label: "How we use information",
    body: (
      <ul>
        <li>To respond to questions and confirm availability, pricing, and reservation details.</li>
        <li>To process and manage rental agreements.</li>
        <li>To contact you about your rental or our services.</li>
        <li>To operate, maintain, and improve our website.</li>
        <li>To comply with applicable laws and enforce rental terms.</li>
      </ul>
    ),
  },
  {
    id: "how-we-share-information",
    label: "How we share information",
    body: (
      <p>
        We do not sell or rent your personal information. We may share information only with service providers who help us operate our business, when required by law, to enforce our agreements, or to protect the rights, safety, and property of Lake Area Rentals, our customers, or others.
      </p>
    ),
  },
  {
    id: "cookies-analytics",
    label: "Cookies and analytics",
    body: (
      <p>
        Our website may use cookies or similar technologies to keep the site working properly and understand how visitors use it. You can disable cookies in your browser settings, though some features may not work as intended.
      </p>
    ),
  },
  {
    id: "data-security",
    label: "Data security",
    body: (
      <p>
        This website does not store your information in any database. We do not keep, sell, or transfer your data through this site. Any details you choose to share with us are sent directly to us by phone or email when you reach out about a rental.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    label: "Children's privacy",
    body: (
      <p>
        Our website is not directed to children under 13, and we do not knowingly collect personal information from them.
      </p>
    ),
  },
  {
    id: "changes",
    label: "Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
      </p>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    body: (
      <>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <p className="leading-relaxed">
          <strong className="font-display uppercase tracking-wide text-forest-700">
            Lake Area Rentals LLC
          </strong>
          <br />
          110 Fisher Cook Rd, Rose Bud, AR 72137
          <br />
          <strong>Phone:</strong> (501) 250-6398
          <br />
          <strong>Email:</strong> info@lakearearentalsllc.com
        </p>
      </>
    ),
  },
];

export default function PolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-paper text-ink overflow-x-hidden">
      {/* ============================================================== HERO */}
      <section className="paper-grain relative">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-12 pb-10 lg:pt-20">
          <p className="font-hand text-2xl sm:text-3xl text-rust-700 -rotate-2 inline-block mb-2">
            the fine print —
          </p>
          <h1 className="font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] uppercase tracking-tight">
            <span className="block text-forest-700">Privacy</span>
            <span className="block italic font-editorial text-ink -mt-1">policy.</span>
          </h1>
          <div className="mt-5 inline-flex items-center gap-3 bg-cream border-2 border-dashed border-ink/30 px-4 py-2 shadow-stamp-sm -rotate-1">
            <span className="inline-block size-2 rounded-full bg-rust-500" />
            <span className="font-display text-xs uppercase tracking-[0.2em] text-ink-soft">
              Last updated · {LAST_UPDATED}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ CONTENT */}
      <section className="paper-grain py-10">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 grid lg:grid-cols-12 gap-10">
          {/* Sidebar — vintage TOC */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 bg-cream border-2 border-ink/15 p-6 shadow-stamp-sm -rotate-[0.4deg]">
              <p className="font-hand text-2xl text-rust-700 leading-none">contents —</p>
              <h2 className="mt-1 font-display text-xl uppercase text-forest-700 tracking-wide">
                On this page
              </h2>
              <nav className="mt-5 flex flex-col gap-1">
                {SECTIONS.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group flex items-baseline gap-3 py-2 border-b border-dashed border-ink/15 last:border-0 font-editorial text-ink-soft hover:text-rust-700 transition-colors"
                  >
                    <span className="font-display text-xs text-ochre-700 tracking-wider w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 leading-snug">{s.label}</span>
                    <span
                      aria-hidden
                      className="text-rust-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      →
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <article className="lg:col-span-8">
            <div className="bg-cream border-2 border-ink/15 p-7 sm:p-10 shadow-stamp">
              <p className="font-editorial italic text-lg leading-relaxed text-ink-soft border-l-4 border-rust-500 pl-5">
                Lake Area Rentals LLC ("we," "us," or "our") respects your privacy. This Privacy
                Policy explains what information we collect when you visit our website or contact
                us about a rental, how we use it, and the choices you have.
              </p>

              <div className="mt-10 space-y-12 policy-prose">
                {SECTIONS.map((s, i) => (
                  <section
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="font-display text-xs text-rust-700 tracking-[0.3em]">
                        § {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl uppercase text-forest-700 leading-tight">
                        {s.label}
                      </h2>
                    </div>
                    <div className="font-body text-ink-soft leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_strong]:text-ink">
                      {s.body}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
