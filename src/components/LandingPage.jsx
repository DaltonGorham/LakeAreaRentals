import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CarIcon,
  RvIcon,
  SxsIcon,
  TrailerIcon,
} from "./Icons";
import { fetchCategoryImages } from "../lib/inventory";
import { PLACEHOLDER_IMAGE } from "./specs";
import "./LandingPage.css";

const categories = [
  {
    label: "Cars",
    type: "car",
    copy: "Clean, comfortable vehicles for errands, weekend trips, and lake visits.",
    icon: <CarIcon />,
  },
  {
    label: "RVs",
    type: "rv",
    copy: "Roomy motorhome rentals for family travel and longer stays.",
    icon: <RvIcon />,
  },
  {
    label: "SXS",
    type: "sxs",
    copy: "Easy electric rides for campgrounds, neighborhoods, and local cruising.",
    icon: <SxsIcon />,
  },
  {
    label: "Trailers",
    type: "trailer",
    copy: "Utility trailer options for equipment, cargo, and project hauling.",
    icon: <TrailerIcon />,
  },
];

const carouselCategories = [...categories, ...categories];

export default function LandingPage() {
  const navigate = useNavigate();
  const [categoryImages, setCategoryImages] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategoryImages()
      .then(setCategoryImages)
      .catch(() => {});
  }, []);

  return (
    <main className="landing-modern">
      <section className="landing-hero" aria-label="Lake Area Rentals">
        <div className="landing-hero-content">
          <h1>Lake Area Rentals</h1>
          <p className="landing-subtitle">
            Cars, RVs, side-by-sides, and trailers for all your needs.
          </p>
        </div>
      </section>

      <section className="landing-categories" aria-labelledby="landing-categories-title">
        <div className="landing-section-head">
          <p className="landing-eyebrow">Rental options</p>
          <h2 id="landing-categories-title">Find the right fit</h2>
        </div>

        <div className="category-carousel" aria-label="Rental categories">
          <div className="category-track">
            {carouselCategories.map(({ label, type, copy, icon }, index) => (
              <button
                key={`${label}-${index}`}
                type="button"
                className="category-tile"
                onClick={() => navigate("/inventory")}
                aria-hidden={index >= categories.length}
                tabIndex={index >= categories.length ? -1 : 0}
              >
                <img src={categoryImages[type] || PLACEHOLDER_IMAGE} alt="" loading="lazy" />
                <span className="category-tile-content">
                  <span className="category-tile-title">
                    {icon} {label}
                  </span>
                  <span className="category-tile-copy">{copy}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-locations" aria-labelledby="landing-locations-title">
        <div className="landing-section-head">
          <p className="landing-eyebrow">Pickup and drop off</p>
          <h2 id="landing-locations-title">Two local locations</h2>
        </div>

        <div className="location-grid">
          <article className="location-panel">
            <div>
              <h3>Heber Springs</h3>
              <p>1819 AR-25, Heber Springs, AR 72543</p>
            </div>
            <iframe
              title="Heber Springs Location"
              src="https://www.google.com/maps?q=1819+AR-25,+Heber+Springs,+AR+72543&output=embed"
              loading="lazy"
              allowFullScreen=""
            />
          </article>

          <article className="location-panel">
            <div>
              <h3>Rose Bud</h3>
              <p>110 Fisher Cook Rd, Rose Bud, AR 72137</p>
            </div>
            <iframe
              title="Rose Bud Location"
              src="https://www.google.com/maps?q=110+Fisher+Cook+Rd,+Rose+Bud,+AR+72137&output=embed"
              loading="lazy"
              allowFullScreen=""
            />
          </article>
        </div>
      </section>
    </main>
  );
}
