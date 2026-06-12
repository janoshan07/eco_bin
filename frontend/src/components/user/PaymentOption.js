import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import '../styles/PaymentOption.css';

const PaymentOption = () => {
  const location = useLocation();
  const { amount } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrorMessage(''); // Reset error message when switching payment methods
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;

    // Allow only digits and limit to 12 characters
    if (/^\d{0,12}$/.test(value)) {
      setCardNumber(value);
      setErrorMessage(''); // Reset error message
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;

    // Allow only digits and limit to 3 characters
    if (/^\d{0,3}$/.test(value)) {
      setCvv(value);
      setErrorMessage(''); // Reset error message
    }
  };

  const handleSubmit = async () => {
    // Reset error message before validation
    setErrorMessage('');

    if (paymentMethod === 'online') {
      // Validate the card number (12 digits), CVV (3 digits), and expiry date
      if (!cardNumber || cardNumber.length !== 12) {
        setErrorMessage('Card number must be exactly 12 digits.');
        return;
      }

      if (!cvv || cvv.length !== 3) {
        setErrorMessage('CVV must be exactly 3 digits.');
        return;
      }

      if (!expiryDate) {
        setErrorMessage('Expiry date is required.');
        return;
      }
    }

    const paymentData = {
      paymentMethod,
      cardNumber: paymentMethod === 'online' ? cardNumber : null,
      expiryDate: paymentMethod === 'online' ? expiryDate : null,
      cvv: paymentMethod === 'online' ? cvv : null,
      saveCard,
    };

    try {
      const response = await fetch('http://localhost:8070/cardpayment/addcardpayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      alert(result.message);

      // Determine payment status based on payment method
      const paymentStatus = paymentMethod === 'online' ? 'completed' : 'pending';

      // Navigate to the Status page and pass payment details
      navigate('/status', { state: { paymentMethod, paymentStatus, amount } });

    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };

  return (
    <div className="recycle-workspace">
      <div className="schedule-card-container">
        <div className="schedule-card-header">
          <h3>Select Payment Option</h3>
          <p className="schedule-card-subtitle">Choose how you want to pay the Rs. {amount || 0}.00 service fee.</p>
        </div>

        <div className="payment-options-grid-modern">
          <div 
            className={`payment-card-option-modern ${paymentMethod === 'online' ? 'active' : ''}`}
            onClick={() => handlePaymentMethodChange('online')}
          >
            <div className="payment-card-icon">
              <i className="bx bx-credit-card"></i>
            </div>
            <div className="payment-card-info">
              <h5>Online Card Payment</h5>
              <p>Pay securely using your credit or debit card details.</p>
            </div>
            <div className="payment-card-check">
              <div className="check-dot"></div>
            </div>
          </div>

          <div 
            className={`payment-card-option-modern ${paymentMethod === 'cash' ? 'active' : ''}`}
            onClick={() => handlePaymentMethodChange('cash')}
          >
            <div className="payment-card-icon">
              <i className="bx bx-money"></i>
            </div>
            <div className="payment-card-info">
              <h5>Cash on Pickup</h5>
              <p>Pay cash directly to the driver during waste handover.</p>
            </div>
            <div className="payment-card-check">
              <div className="check-dot"></div>
            </div>
          </div>
        </div>

        {paymentMethod === 'online' && (
          <div className="card-details-section">
            <h4>Enter Card Details</h4>
            
            <div className="form-group-modern">
              <label htmlFor="card-number">Card Number</label>
              <input
                type="text"
                id="card-number"
                placeholder="12-digit Card Number"
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>

            <div className="form-row-grid">
              <div className="form-group-modern">
                <label htmlFor="expiry">Expiry Date</label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YYYY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="3 Digits"
                  value={cvv}
                  onChange={handleCvvChange}
                />
              </div>
            </div>

            {errorMessage && (
              <p className="form-error-lbl" style={{ textAlign: 'center', marginTop: '1rem' }}>
                {errorMessage}
              </p>
            )}
          </div>
        )}

        <div className="schedule-actions-footer">
          <button
            type="button"
            className="wizard-back-btn"
            onClick={() => navigate('/addpaymentdetails', { state: { amount } })}
          >
            <i className="bx bx-left-arrow-alt"></i>
            <span>Back</span>
          </button>
          <button className="schedule-confirm-btn" onClick={handleSubmit}>
            <span>Complete Payment</span>
            <i className="bx bx-check-shield"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOption;
