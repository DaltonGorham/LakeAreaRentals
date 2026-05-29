import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><button onClick={() => navigate("/inventory")}>Inventory</button></li>
            <li><button onClick={() => navigate("/about")}>About Us</button></li>
            <li><button onClick={() => navigate("/rental-agreement")}>Rental Agreement</button></li>
            <li><button onClick={() => navigate("/privacy-policy")}>Privacy Policy</button></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Hours</h4>
          <p>Monday - Friday: 8AM - 6PM</p>
          <p>Saturday: 9AM - 6PM</p>
          <p>Sunday: 10AM - 6PM</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Lake Area Rentals LLC. All rights reserved.</p>
        <p className="footer-legal">
          <button onClick={() => navigate("/privacy-policy")}>Privacy Policy</button>
        </p>
      </div>
    </footer>
  );
}