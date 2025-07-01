import React from "react";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About <span className="highlight">Lake Area Rentals</span></h1>
        <p className="about-tagline">
          Serving Heber Springs and the surrounding area with reliable rentals and friendly service.
        </p>
      </div>
      <div className="about-content">
        <section>
          <h2>Who We Are</h2>
          <p>
            Lake Area Rentals is a locally owned and operated business dedicated to providing top-quality cars, RVs, and side-by-sides for every adventure. Whether you’re exploring the Ozarks, heading out on a family trip, or need a vehicle for business, we have you covered.
          </p>
        </section>
        <section>
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Wide selection of clean, well-maintained vehicles</li>
            <li>Friendly, knowledgeable staff</li>
            <li>Convenient location in Heber Springs or Rose Bud Arkansas</li>
          </ul>
        </section>
        <section>
          <h2>Contact & Location</h2>
          <p>
            <strong>Address:</strong> 1819 AR-25, Heber Springs, AR 72543<br />
            <strong>Phone:</strong> (501) 250-6398<br />
            <strong>Email:</strong> info@lakearearentals.com
          </p>
          <iframe
            title="Lake Area Rentals Location"
            src="https://www.google.com/maps?q=1819+AR-25,+Heber+Springs,+AR+72543&output=embed"
            width="100%"
            height="180"
            style={{ border: 0, borderRadius: "10px", marginTop: "1rem" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </section>
      </div>
    </div>
  );
}