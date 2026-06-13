import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CarIcon, CheckIcon, GridIcon, MailIcon, PhoneIcon } from "./Icons";
import { fetchCategoryImages } from "../lib/inventory";
import { PLACEHOLDER_IMAGE } from "./specs";
import "./AboutPage.css";

export default function AboutPage() {
  const [categoryImages, setCategoryImages] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoryImages()
      .then(setCategoryImages)
      .catch(() => {});
  }, []);

  // First available image across categories, used for the hero/intro.
  const introImage =
    categoryImages.car ||
    categoryImages.sxs ||
    categoryImages.rv ||
    categoryImages.trailer ||
    PLACEHOLDER_IMAGE;

  const benefits = [
    {
      icon: <CarIcon />,
      title: "Practical rentals for real local needs",
      copy: "Choose from cars, RVs, side-by-sides, and trailers for lake weekends, family travel, local errands, and hauling jobs.",
    },
    {
      icon: <PhoneIcon />,
      title: "Talk directly with a local team",
      copy: "Call or email to confirm availability, pricing, pickup details, and anything specific you need before you book.",
    },
    {
      icon: <CheckIcon />,
      title: "Simple paperwork before pickup",
      copy: "Complete the rental agreement ahead of time so pickup is faster and the details are clear.",
    },
    {
      icon: <GridIcon />,
      title: "We work with most insurance agencies",
      copy: "If your rental is connected to an insurance claim, we can help coordinate the details with most insurance agencies.",
    },
  ];

  const steps = [
    {
      title: "Find the right rental",
      copy: "Browse inventory and pick the vehicle, RV, side-by-side, or trailer that fits your plans.",
      image: categoryImages.car || PLACEHOLDER_IMAGE,
    },
    {
      title: "Call or email for pricing",
      copy: "We confirm availability, pricing, pickup timing, and rental requirements directly with you.",
      image: categoryImages.sxs || PLACEHOLDER_IMAGE,
    },
    {
      title: "Fill out the rental form",
      copy: "Submit the rental agreement before pickup so everything is ready when you arrive.",
      image: categoryImages.trailer || PLACEHOLDER_IMAGE,
    },
  ];

  return (
    <div className="about-container">
      <section className="about-intro" aria-labelledby="about-intro-title">
        <div className="about-intro-media">
          <img src={introImage} alt="Lake Area Rentals vehicle ready for pickup" />
        </div>
        <div className="about-intro-copy">
          <p className="about-eyebrow">Lake Area Rentals</p>
          <h1 id="about-intro-title">How rentals work here</h1>
          <p>
            Browse what is available, call or email for current pricing, and complete the rental form before pickup.
          </p>
          <div className="about-intro-actions">
            <Link to="/inventory">View inventory</Link>
            <a href="tel:501-250-6398">Call now</a>
          </div>
        </div>
      </section>

      <div className="about-content">
        <section className="about-benefits" aria-labelledby="about-benefits-title">
          <h2 id="about-benefits-title">Why choose Lake Area Rentals?</h2>
          <div className="about-benefit-list">
            {benefits.map((benefit) => (
              <article className="about-benefit" key={benefit.title}>
                <span className="about-benefit-icon">{benefit.icon}</span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="about-benefits-action">
            <Link to="/inventory">Find a rental</Link>
          </div>
        </section>

        <section className="about-booking-flow" aria-labelledby="about-booking-title">
          <h2 id="about-booking-title">How to book a rental</h2>
          <div className="about-step-grid">
            {steps.map((step, index) => (
              <article className="about-step" key={step.title}>
                <div className="about-step-image">
                  <img src={step.image} alt="" loading="lazy" />
                </div>
                <h3>{index + 1}. {step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-contact-strip" aria-labelledby="about-contact-title">
          <div className="about-contact-copy">
            <h2 id="about-contact-title">Ready to check availability?</h2>
            <p>Call or email for pricing, pickup details, and rental requirements.</p>
          </div>
          <div className="about-contact-actions">
            <a href="tel:501-250-6398"><PhoneIcon /> (501) 250-6398</a>
            <a href="mailto:info@lakearearentalsllc.com"><MailIcon /> Email us</a>
            <Link to="/rental-agreement"><GridIcon /> Rental form</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
