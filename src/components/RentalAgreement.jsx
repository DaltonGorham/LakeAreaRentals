import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, MailIcon, PhoneIcon } from "./Icons";

const STEPS = [
  {
    title: "Download the form",
    copy: "Tap the button to grab the rental agreement PDF.",
  },
  {
    title: "Fill it out completely",
    copy: "Complete every required field using Adobe Reader, Preview, or any PDF editor.",
  },
  {
    title: "Email it back",
    copy: "Send the completed form to info@lakearearentalsllc.com so we can review it.",
  },
  {
    title: "We'll confirm with you",
    copy: "We'll check the details and reach out to lock in pickup time and any specifics.",
  },
];

export default function RentalAgreement() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "./rental-agreement-form.pdf";
    link.download = "Lake-Area-Rentals-Agreement.pdf";
    link.click();
  };

  return (
    <main className="bg-paper text-ink overflow-x-hidden">
      {/* ============================================================== HERO */}
      <section className="paper-grain relative">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 pt-12 pb-12 lg:pt-20">
          <h1 className="reveal font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] uppercase tracking-tight">
            <span className="block text-forest-700">Rental</span>
            <span className="block italic font-editorial text-ink -mt-1">agreement</span>
          </h1>
          <p className="reveal mt-5 max-w-2xl font-editorial italic text-xl sm:text-2xl leading-snug text-ink-soft">
            Download the form and send it our way — or head to a vehicle's page to request
            your dates online.
          </p>
          <Link
            to="/inventory"
            className="reveal mt-5 inline-flex items-center gap-2 bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-3.5 rounded-[2px] hover:bg-forest-700 transition-colors"
          >
            Browse inventory to book online
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ======================================================== DOWNLOAD + STEPS */}
      <section className="paper-grain py-10 sm:py-16">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 grid lg:grid-cols-12 gap-10">
          {/* Download envelope card */}
          <div className="lg:col-span-5">
            <div className="relative bg-cream border-2 border-ink/15 rounded-md shadow-card p-8 sm:p-10">
              <div className="relative mx-auto w-28 h-36 mb-6 bg-cream border-2 border-ink grid place-items-end p-2">
                <span className="self-start absolute top-2 left-2 font-display text-rust-700 text-xs tracking-[0.2em]">
                  PDF
                </span>
                <div className="w-full space-y-1.5 pb-2">
                  <span className="block h-1 bg-ink/20 w-3/4" />
                  <span className="block h-1 bg-ink/20 w-5/6" />
                  <span className="block h-1 bg-ink/20 w-1/2" />
                  <span className="block h-1 bg-ink/20 w-2/3" />
                  <span className="block h-3 bg-ink/40 w-1/3 mt-2" />
                </div>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl uppercase text-forest-700 text-center leading-tight">
                Prefer paper?
              </h2>
              <p className="mt-3 text-center font-editorial italic text-ink-soft">
                Save the PDF, fill every field, send it our way for review.
              </p>

              <button
                onClick={handleDownload}
                className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-rust-500 text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-4 rounded-[2px] hover:bg-rust-700 transition-colors"
              >
                Download PDF
                <span aria-hidden>↓</span>
              </button>

              <p className="mt-4 text-center text-xs text-ink-soft font-body">
                Need a hand? Call (501) 250-6398.
              </p>
            </div>
          </div>

          {/* Steps checklist */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-4xl sm:text-5xl uppercase text-forest-700 leading-[0.95]">
              How the paper
              <br />
              <span className="italic font-editorial text-ink">route works</span>
            </h2>

            <ol className="mt-10 space-y-5">
              {STEPS.map(({ title }, i) => (
                <li
                  key={title}
                  className="relative bg-cream border-2 border-ink/15 rounded-md p-6 sm:p-7 flex items-start gap-5"
                >
                  <span className="shrink-0 relative grid place-items-center size-14 rounded-full bg-forest-700 text-paper">
                    <CheckIcon className="text-xl" />
                    <span className="absolute -top-2 -right-2 grid place-items-center size-7 bg-ochre-500 text-ink font-display text-sm rounded-full border-2 border-paper">
                      {i + 1}
                    </span>
                  </span>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl uppercase text-forest-700 leading-tight">
                      {title}
                    </h3>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* =========================================================== CONTACT */}
      <section className="py-16">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10">
          <div className="relative bg-forest-700 text-paper p-8 sm:p-12 rounded-md grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl sm:text-5xl uppercase leading-[0.95]">
                Questions on
                <br />
                <span className="italic font-editorial text-ochre-300">pricing or pickup?</span>
              </h2>
              <p className="mt-3 font-editorial italic text-paper/85 max-w-md">
                Reach out before submitting — we'll talk through availability and details.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3">
              <a
                href="tel:501-250-6398"
                className="flex items-center justify-between gap-4 bg-paper text-ink px-5 py-4 rounded-[2px] font-display uppercase tracking-[0.18em] text-sm hover:bg-cream transition-colors"
              >
                <span className="flex items-center gap-3">
                  <PhoneIcon className="text-xl text-rust-500" /> (501) 250-6398
                </span>
                <span aria-hidden>→</span>
              </a>
              <a
                href="mailto:info@lakearearentalsllc.com"
                className="flex items-center justify-between gap-4 bg-rust-500 text-paper px-5 py-4 rounded-[2px] font-display uppercase tracking-[0.18em] text-sm hover:bg-rust-700 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <MailIcon className="text-xl" /> Email us
                </span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
