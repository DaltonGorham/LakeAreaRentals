import { useEffect } from "react";
import { CheckIcon, MailIcon, PhoneIcon } from "./Icons";
import "./RentalAgreement.css";

export default function RentalAgreement() {
  useEffect(() => {
    window.scrollTo(0, 0); 
    }, []);  
    
  const handleDownload = () => {

    const link = document.createElement('a');
    link.href = './rental-agreement-form.pdf'; 
    link.download = 'Lake-Area-Rentals-Agreement.pdf';
    link.click();
  };

  return (
    <div className="rental-container">
      <section className="rental-header">
        <p className="rental-eyebrow">Rental form</p>
        <h1>Rental agreement</h1>
        <p className="rental-tagline">
          Download the form, fill it out, and email it back before pickup so your rental is ready to go.
        </p>
      </section>

      <div className="rental-content">
        <section className="download-section">
          <div className="download-card">
            <div className="pdf-icon" aria-hidden="true">PDF</div>
            <h2>Download Rental Agreement</h2>
            <p>
              Save the PDF, complete each required field, then send it to our team for review.
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
              <div className="step-number"><CheckIcon /></div>
              <div className="step-content">
                <h3>Download the Form</h3>
                <p>Click the download button above to get the rental agreement PDF.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number"><CheckIcon /></div>
              <div className="step-content">
                <h3>Fill Out Completely</h3>
                <p>Complete all required fields in the PDF form using Adobe Reader or similar.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number"><CheckIcon /></div>
              <div className="step-content">
                <h3>Email Back to Us</h3>
                <p>Send the completed form to <strong>info@lakearearentalsllc.com</strong></p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number"><CheckIcon /></div>
              <div className="step-content">
                <h3>We'll Confirm</h3>
                <p>We'll review your application and contact you to confirm your rental.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div>
            <h2>Questions?</h2>
            <p>
              If you have questions about pricing, availability, or the form, contact us before submitting.
            </p>
          </div>
          <div className="contact-info">
            <a href="tel:501-250-6398"><PhoneIcon /> (501) 250-6398</a>
            <a href="mailto:info@lakearearentalsllc.com"><MailIcon /> Email us</a>
          </div>
        </section>
      </div>
    </div>
  );
}
