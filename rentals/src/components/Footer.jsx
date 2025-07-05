import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Lake Area Rentals</h3>
          <p>Your trusted partner for vehicle rentals in Heber Springs and the surrounding lake area.</p>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>110 Fisher Cook Rd, Rose Bud, AR 72137</p>
          <p>Phone: (501) 250-6398</p>
          <p>Email: info@lakearearentals.com</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><button onClick={() => navigate("/inventory")}>Inventory</button></li>
            <li><button onClick={() => navigate("/about")}>About Us</button></li>
            <li><button onClick={() => navigate("/rental-agreement")}>Rental Agreement</button></li>
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
        <p>© {new Date().getFullYear()} Lake Area Rentals LLC. All rights reserved.</p>
      </div>
    </footer>
  );
}