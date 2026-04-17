import { useState } from 'react';
import './CardModal.css';

const SPECS = {
  car: (item) => [
    ['Fuel', item.fuel_type],
    ['MPG City', item.mpg_city],
    ['MPG Highway', item.mpg_highway],
    ['Seats', item.seats],
  ],
  sxs: (item) => [
    ['Engine', item.engine],
    ['Fuel', item.fuel_type],
    ['Horse Power', item.horse_power],
    ['Torque', item.torque],
    ['Seats', item.seats],
  ],
  rv: (item) => [
    ['Fuel', item.fuel_type],
    ['MPG City', item.mpg_city],
    ['MPG Highway', item.mpg_highway],
    ['Sleeps', item.sleeps],
  ],
  trailer: (item) => [
    ['Length', item.length],
    ['Loading Ramps', item.loading_ramps ? 'Yes' : 'No'],
  ],
};

export default function InventoryCard({ item, type }) {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpandedView, setIsExpandedView] = useState(false);

  const images = item.images || [item.image];
  const totalImages = images.length;
  const isSingleImage = totalImages === 1;

  const openModal = () => {
    setCurrentImageIndex(0);
    setIsExpandedView(false);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setIsExpandedView(false);
  };

  const stop = (e) => e.stopPropagation();

  const nextImage = () =>
    setCurrentImageIndex((i) => (i === totalImages - 1 ? 0 : i + 1));
  const prevImage = () =>
    setCurrentImageIndex((i) => (i === 0 ? totalImages - 1 : i - 1));

  const specs = (SPECS[type] || (() => []))(item);

  return (
    <>
      <article className="inventory-card" onClick={openModal}>
        <div className="card-image">
          <img src={images[0]} alt={item.name} loading="lazy" />
        </div>
        <div className="card-body">
          <h3>{item.name}</h3>
          <p className="price">${item.price_per_day}<span>/day</span></p>
          <div className="actions" onClick={stop}>
            <a href="tel:501-250-6398" className="btn btn-primary" aria-label="Call for more details">
              📞 Call
            </a>
            <a href="mailto:info@lakearearentalsllc.com" className="btn btn-secondary" aria-label="Email for more details">
              ✉️ Email
            </a>
          </div>
        </div>
      </article>

      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className={`modal-content${isExpandedView ? ' expanded' : ''}`} onClick={stop}>
            <div className="modal-header">
              <button className="close-button" onClick={closeModal} aria-label="Close">
                &times;
              </button>
              <h4>{item.name}</h4>
            </div>

            <div className="modal-body">
              <div className={`image-container${isExpandedView ? ' expanded' : ''}`} data-single-image={isSingleImage}>
                <div className="image-stage">
                  <img
                    className="modal-main-image"
                    src={images[currentImageIndex]}
                    alt={`${item.name} - Image ${currentImageIndex + 1}`}
                  />
                </div>
                {!isSingleImage && (
                  <>
                    <button type="button" className="nav-arrow prev" onClick={prevImage} aria-label="Previous image">‹</button>
                    <button type="button" className="nav-arrow next" onClick={nextImage} aria-label="Next image">›</button>
                    <div className="image-counter">
                      <span className="current-image">{currentImageIndex + 1}</span> / <span className="total-images">{totalImages}</span>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                className="image-size-toggle"
                onClick={() => setIsExpandedView((value) => !value)}
              >
                {isExpandedView ? 'Default size' : 'View larger'}
              </button>

              {!isSingleImage && (
                <div className="thumbnail-row" aria-label="Image thumbnails">
                  {images.map((image, index) => (
                    <button
                      key={`${item.id}-${index}`}
                      type="button"
                      className={`thumbnail-button${index === currentImageIndex ? ' active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img src={image} alt={`${item.name} thumbnail ${index + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              <div className="specs">
                {specs.map(([label, value]) => (
                  <p key={label}><strong>{label}:</strong> {value}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
