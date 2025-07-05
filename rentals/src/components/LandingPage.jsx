import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-modern">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            <span className="highlight">Lake Area Rentals</span>
          </h1>
          <p className="subtitle">
            Reliable cars, RVs, and side-by-sides for every adventure in Heber Springs and beyond.
          </p>
          <div className="cta-buttons">
            <button className="primary" onClick={() => navigate("/inventory")}>
              View Inventory
            </button>
            <button className="secondary" onClick={() => navigate("/about")}>
              About Us
            </button>
          </div>
        </div>
        <div className="hero-image" >
            <img src="./logo.png" alt="Lake Area Rentals Logo"></img>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card rental-card">
          <h2>Ready to Rent?</h2>
          <p>Download our rental agreement form to get started with your reservation.</p>
          <button 
            className="rental-btn"
            onClick={() => navigate("/rental-agreement")}
          >
            Get Rental Form
          </button>
        </div>

        <div className="feature-card location-card">
          <h2>Pick Up / Drop Off Locations</h2>
          <div className="locations-container">
            <div className="location">
              <h3>Heber Springs</h3>
              <p>1819 AR-25, Heber Springs, AR 72543</p>
              <iframe
                title="Heber Springs Location"
                src="https://www.google.com/maps?q=1819+AR-25,+Heber+Springs,+AR+72543&output=embed"
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: "10px", marginTop: "1rem" }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
            
            <div className="location">
              <h3>Rose Bud</h3>
              <p>110 Fisher Cook Rd, Rose Bud, AR 72137</p>
              <iframe
                title="Rose Bud Location"
                src="https://www.google.com/maps?q=110+Fisher+Cook+Rd,+Rose+Bud,+AR+72137&output=embed"
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: "10px", marginTop: "1rem" }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}