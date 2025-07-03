import { useState } from 'react';
import './CardModal.css';

const CarCard = ({ car }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = car.images || [car.image]; // Fallback to single image if no images array

  const totalImages = images.length;
  const isSingleImage = totalImages === 1;

  

  const handleToggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      // Reset image index when opening the modal
      setCurrentImageIndex(0);
    }
  };



  const handleModalClick = (event) => {
    // Prevent clicks inside the modal content from closing the modal
    event.stopPropagation();
  };

    const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  const currentImage = images[currentImageIndex];
  const cardImage = images[0] || car.image;

  return (
    <>
      <div className="car-card" onClick={handleToggleModal}>
        <img src={`${import.meta.env.BASE_URL}${cardImage}`} alt={car.name} />
        <h3>{car.name}</h3>
        <p>${car.price_per_day}/day</p>
        <div className="actions">
            <a href="tel:501-250-6398" aria-label="Call for more details">
            <button>📞 Call for More Details</button>
            </a>
            <a href="mailto:info@lakearearentals.com" aria-label="Email for more details">
            <button>✉️ Email for More Details</button>
            </a>
        </div>
      </div>

 {showModal && (
        <div className="modal" onClick={handleToggleModal}>
          <div className="modal-content" onClick={handleModalClick}>
            <div className="modal-header">
              <button className="close-button" onClick={handleToggleModal}>
                &times;
              </button>
              <h4>{car.name}</h4>
            </div>
            
            <div className="modal-body">
              <div 
                className="image-container" 
                data-single-image={isSingleImage}
              >
                <img 
                  src={currentImage} 
                  alt={`${car.name} - Image ${currentImageIndex + 1}`} 
                />
                
                {!isSingleImage && (
                  <>
                    <button 
                      className="nav-arrow prev" 
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    
                    <button 
                      className="nav-arrow next" 
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                    
                    <div className="image-counter">
                      <span className="current-image">{currentImageIndex + 1}</span> / <span className="total-images">{totalImages}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="specs">
                <p><strong>Fuel: </strong>{car.fuel_type}</p>
                <p><strong>MPG City: </strong>{car.mpg_city}</p>
                <p><strong>MPG Highway: </strong>{car.mpg_highway}</p>
                <p><strong>Seats: </strong>{car.seats}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarCard;