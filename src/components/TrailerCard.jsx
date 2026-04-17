import { useState } from 'react';
import './CardModal.css';

const TrailerCard = ({ trailer }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = trailer.images || [trailer.image]; // Fallback to single image if no images array

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
  const cardImage = images[0] || trailer.image;

  return (
    <>
      <div className="trailer-card" onClick={handleToggleModal}>
        <img src={cardImage} alt={trailer.name} />
        <h3>{trailer.name}</h3>
        <p>${trailer.price_per_day}/day</p>
        <div className="actions">
            <a href="tel:501-250-6398" aria-label="Call for more details">
            <button>📞 Call for More Details</button>
            </a>
            <a href="mailto:info@lakearearentalsllc.com" aria-label="Email for more details">
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
              <h4>{trailer.name}</h4>
            </div>
            
            <div className="modal-body">
              <div 
                className="image-container" 
                data-single-image={isSingleImage}
              >
                <img 
                  src={currentImage} 
                  alt={`${trailer.name} - Image ${currentImageIndex + 1}`} 
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
                <p><strong>Length:</strong> {trailer.length}</p>
                <p><strong>Loading Ramps:</strong> {trailer.loading_ramps ? 'Yes' : 'No'}</p>
                <p><strong>Price per Day:</strong> ${trailer.price_per_day}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrailerCard;