import { useState } from 'react';
import './CardModal.css';

const RvCard = ({ rv }) => {
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
      <div className="rv-card" onClick={handleToggleModal}>
        <img src={rv.image} alt={rv.name} />
        <h3>{rv.name}</h3>
        <p>${rv.price_per_day}/day</p>
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
            <h4>{rv.name}</h4>
            <img src={rv.image} alt={rv.name} />
            <div className="description-section">
                <p>{rv.description}</p>
            </div>
            <div className="specs">
                <p><strong>Fuel: </strong>{rv.fuel_type}</p>
                <p><strong>MPG City: </strong>{rv.mpg_city}</p>
                <p><strong>MPG Highway: </strong>{rv.mpg_highway}</p>
                <p><strong>Sleeps: </strong>{rv.sleeps}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RvCard;