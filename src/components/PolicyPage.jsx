import { useEffect } from "react";
import "./AboutPage.css";

export default function PolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "May 29, 2026";
  const sections = [
    { id: "information-we-collect", label: "Information we collect" },
    { id: "how-we-use-information", label: "How we use information" },
    { id: "how-we-share-information", label: "How we share information" },
    { id: "cookies-analytics", label: "Cookies and analytics" },
    { id: "data-security", label: "Data security" },
    { id: "childrens-privacy", label: "Children's privacy" },
    { id: "changes", label: "Changes to this policy" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="about-container policy-page">
      <section className="about-hero policy-hero">
        <h1>Privacy policy</h1>
        <p className="policy-revised">Last updated: {lastUpdated}</p>
      </section>

      <div className="policy-layout">
        <aside className="policy-toc" aria-label="Table of contents">
          <h2>Contents</h2>
          <nav>
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="policy-main">
          <p className="policy-intro-text">
            Lake Area Rentals LLC ("we," "us," or "our") respects your privacy. This Privacy Policy explains what information we collect when you visit our website or contact us about a rental, how we use it, and the choices you have.
          </p>

          <section id="information-we-collect" className="policy-section">
            <h2>Information we collect</h2>
            <p>We only collect information you choose to share with us, including:</p>
            <ul>
              <li>Contact details you provide by phone, email, or our rental agreement form, such as your name, phone number, and email address.</li>
              <li>Rental and driver information you submit to complete a reservation, such as driver's license details, requested dates, and vehicle interest.</li>
              <li>Basic technical data your browser sends automatically, such as IP address, device type, pages viewed, and standard server log information.</li>
            </ul>
          </section>

          <section id="how-we-use-information" className="policy-section">
            <h2>How we use information</h2>
            <ul>
              <li>To respond to questions and confirm availability, pricing, and reservation details.</li>
              <li>To process and manage rental agreements.</li>
              <li>To contact you about your rental or our services.</li>
              <li>To operate, maintain, and improve our website.</li>
              <li>To comply with applicable laws and enforce rental terms.</li>
            </ul>
          </section>

          <section id="how-we-share-information" className="policy-section">
            <h2>How we share information</h2>
            <p>
              We do not sell or rent your personal information. We may share information only with service providers who help us operate our business, when required by law, to enforce our agreements, or to protect the rights, safety, and property of Lake Area Rentals, our customers, or others.
            </p>
          </section>

          <section id="cookies-analytics" className="policy-section">
            <h2>Cookies and analytics</h2>
            <p>
              Our website may use cookies or similar technologies to keep the site working properly and understand how visitors use it. You can disable cookies in your browser settings, though some features may not work as intended.
            </p>
          </section>

          <section id="data-security" className="policy-section">
            <h2>Data security</h2>
            <p>
              This website does not store your information in any database. We do not keep, sell, or transfer your data through this site. Any details you choose to share with us are sent directly to us by phone or email when you reach out about a rental.
            </p>
          </section>

          <section id="childrens-privacy" className="policy-section">
            <h2>Children's privacy</h2>
            <p>
              Our website is not directed to children under 13, and we do not knowingly collect personal information from them.
            </p>
          </section>

          <section id="changes" className="policy-section">
            <h2>Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
            </p>
          </section>

          <section id="contact" className="policy-section">
            <h2>Contact</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <p>
              <strong>Lake Area Rentals LLC</strong><br />
              110 Fisher Cook Rd, Rose Bud, AR 72137<br />
              <strong>Phone:</strong> (501) 250-6398<br />
              <strong>Email:</strong> info@lakearearentalsllc.com
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
