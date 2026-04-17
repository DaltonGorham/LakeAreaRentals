import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="header-content">
        <span className="logo">
          <Link to="/" className="logo-link">Lake Area Rentals</Link>
        </span>
        <nav className="main-nav">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/inventory" className={location.pathname === "/inventory" ? "active" : ""}>Inventory</Link>
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
        </nav>
      </div>
    </header>
  );
}