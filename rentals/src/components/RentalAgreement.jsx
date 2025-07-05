import React, { useEffect } from "react";
import "./RentalAgreement.css";

export default function RentalAgreement() {
  useEffect(() => {
    window.scrollTo(0, 0); 
    }, []);  
    
  const handleDownload = () => {
    // Create a link to download the PDF
    const link = document.createElement('a');
    link.href = './rental-agreement-form.pdf'; // Put your PDF in the public folder
    link.download = 'Lake-Area-Rentals-Agreement.pdf';
    link.click();
  };

  return (
    <div className="rental-container">
      <div className="rental-header">
        <h1>Rental <span className="highlight">Agreement</span></h1>
        <p className="rental-tagline">
          Download, complete, and email back our rental agreement form
        </p>
      </div>

      <div className="rental-content">
        <section className="download-section">
          <div className="download-card">
            <div className="pdf-icon">
              📄
            </div>
            <h2>Download Rental Agreement</h2>
            <p>
              Click the button below to download our rental agreement form. 
              Please fill it out completely and email it back to us.
            </p>
            
            <button className="download-btn" onClick={handleDownload}>
              Download PDF Form
            </button>
          </div>
        </section>

        <section className="instructions-section">
          <h2>How to Complete Your Rental</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Download the Form</h3>
                <p>Click the download button above to get the rental agreement PDF.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Fill Out Completely</h3>
                <p>Complete all required fields in the PDF form using Adobe Reader or similar.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Email Back to Us</h3>
                <p>Send the completed form to <strong>info@lakearearentals.com</strong></p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>We'll Confirm</h3>
                <p>We'll review your application and contact you to confirm your rental.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2>Questions?</h2>
          <p>
            If you have any questions about the rental process or need assistance, 
            feel free to contact us:
          </p>
          <div className="contact-info">
            <p><strong>Phone:</strong> (501) 250-6398</p>
            <p><strong>Email:</strong> info@lakearearentals.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}