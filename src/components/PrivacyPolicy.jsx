import React, { useEffect } from "react";
import "./AboutPage.css";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "May 29, 2026";

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>Privacy <span className="highlight">Policy</span></h1>
        <p className="about-tagline">
          How Lake Area Rentals collects, uses, and protects your information.
        </p>
      </div>
      <div className="about-content">
        <section>
          <p><strong>Last updated:</strong> {lastUpdated}</p>
          <p>
            Lake Area Rentals LLC ("we," "us," or "our") respects your privacy. This Privacy
            Policy explains what information we collect when you visit our website or contact us
            about a rental, how we use it, and the choices you have. By using this site, you agree
            to the practices described below.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>We only collect information you choose to share with us, including:</p>
          <ul>
            <li>Contact details you provide by phone, email, or our rental agreement form — such as your name, phone number, and email address</li>
            <li>Rental and driver information you submit to complete a reservation, such as your driver's license details and the dates and vehicles you are interested in.</li>
            <li>Basic technical data your browser sends automatically, such as your IP address, device type, and pages viewed, which may be recorded in standard server logs.</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To respond to your questions and confirm availability, pricing, and reservation details.</li>
            <li>To process and manage your rental agreement.</li>
            <li>To contact you about your rental or our services.</li>
            <li>To operate, maintain, and improve our website.</li>
            <li>To comply with applicable laws and enforce our rental terms.</li>
          </ul>
        </section>

        <section>
          <h2>How We Share Information</h2>
          <p>
            We do not sell or rent your personal information. We may share it only with service
            providers who help us operate our business (for example, website hosting), or when
            required by law, to enforce our agreements, or to protect the rights, safety, and
            property of Lake Area Rentals, our customers, or others.
          </p>
        </section>

        <section>
          <h2>Cookies & Analytics</h2>
          <p>
            Our website may use cookies or similar technologies to keep the site working properly
            and to understand how visitors use it. You can disable cookies in your browser
            settings, though some features may not work as intended.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We take reasonable steps to protect the information you share with us. However, no
            method of transmission or storage is completely secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2>Children's Privacy</h2>
          <p>
            Our website is not directed to children under 13, and we do not knowingly collect
            personal information from them.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated "Last updated" date.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <p>
            <strong>Lake Area Rentals LLC</strong><br />
            110 Fisher Cook Rd, Rose Bud, AR 72137<br />
            <strong>Phone:</strong> (501) 250-6398<br />
            <strong>Email:</strong> info@lakearearentalsllc.com
          </p>
        </section>
      </div>
    </div>
  );
}
