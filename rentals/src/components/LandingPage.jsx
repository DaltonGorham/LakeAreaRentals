import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

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
        <div className="feature-card">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Wide Variety of vehicles</li>
            <li>Friendly, local service</li>
            <li>Flexible rental terms</li>
            <li>Convenient location</li>
          </ul>
        </div>
        <div className="feature-card location-card">
          <h2>Visit Us</h2>
          <p>1819 AR-25, Heber Springs, AR 72543</p>
          <iframe
            title="Lake Area Rentals Location"
            src="https://www.google.com/maps?q=1819+AR-25,+Heber+Springs,+AR+72543&output=embed"
            width="100%"
            height="180"
            style={{ border: 0, borderRadius: "10px", marginTop: "1rem" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

       <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Lake Area Rentals</h3>
            <p>Your trusted partner for vehicle rentals in Heber Springs and the surrounding lake area.</p>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>1819 AR-25, Heber Springs, AR 72543</p>
            <p>Phone: (501) 250-6398</p>
            <p>Email: info@lakearearentals.com</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => navigate("/inventory")}>Inventory</button></li>
              <li><button onClick={() => navigate("/about")}>About Us</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Hours</h4>
            <p>Monday - Friday: 8AM - 6PM</p>
            <p>Saturday: 9AM - 5PM</p>
            <p>Sunday: 10AM - 4PM</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Lake Area Rentals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}