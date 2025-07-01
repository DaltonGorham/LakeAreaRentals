import { useState } from 'react';
import './CardModal.css';

const CarCard = ({ car }) => {
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleModalClick = (event) => {
    // Prevent clicks inside the modal content from closing the modal
    event.stopPropagation();
  };

  return (
    <>
      <div className="car-card" onClick={handleToggleModal}>
        <img src={car.image} alt={car.name} />
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
            <button className="close-button" onClick={handleToggleModal}>
              &times;
            </button>
            <h4>{car.name}</h4>
            <img src={car.image} alt={car.name} />
            <div className="specs">
                <p><strong>Fuel: </strong>{car.fuel_type}</p>
                <p><strong>MPG City: </strong>{car.mpg_city}</p>
                <p><strong>MPG Highway: </strong>{car.mpg_highway}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarCard;