import { useState } from 'react';
import './CardModal.css';

const SxsCard = ({ sxs }) => {
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
      <div className="sxs-card" onClick={handleToggleModal}>
        <img src={`${import.meta.env.BASE_URL}${sxs.image}`} alt={sxs.name} />
        <h3>{sxs.name}</h3>
        <p>${sxs.price_per_day}/day</p>
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
            <h4>{sxs.name}</h4>
            <img src={`${import.meta.env.BASE_URL}${sxs.image}`} alt={sxs.name} />
            <div className="specs">
                <p><strong>Engine: </strong>{sxs.engine}</p>
                <p><strong>Fuel: </strong>{sxs.fuel_type}</p>
                <p><strong>Hore Power: </strong>{sxs.horse_power}</p>
                <p><strong>Torque: </strong>{sxs.torque}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SxsCard;