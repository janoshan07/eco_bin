import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CalculatePayment.css';

const CalculatePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { garbageId, weight } = location.state || {}; // Destructure state from navigation

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const ratePerKg = 10; // Example rate

  useEffect(() => {
    if (weight) {
      const calculatedAmount = weight * ratePerKg; // Calculate amount based on weight
      setAmount(calculatedAmount);
    }
  }, [weight]); // Recalculate if weight changes

  const handleAddPayment = async () => {
    if (!garbageId || !amount) {
      setError('Invalid payment details. Please try again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8070/calculatepayment/addpaymentdetails', {
        garbageId,
        amount
      });
      console.log('Payment added:', response.data);
      setSuccessMessage('Payment added successfully.');
      setError(''); // Clear error if payment is successful

      // Navigate to /addcardpayment and pass amount in state
      navigate('/addcardpayment', { state: { amount } });
    } catch (error) {
      console.error('Error adding payment:', error);
      setError('Failed to add payment. Please try again later.');
    }
  };

  return (
    <div className="recycle-workspace">
      <div className="schedule-card-container">
        <div className="schedule-card-header">
          <h3>Fee Summary & Payment Details</h3>
          <p className="schedule-card-subtitle">Review the calculated service charge for your special garbage pickup.</p>
        </div>

        {garbageId && weight ? (
          <div className="payment-summary-box">
            <div className="summary-item-row">
              <span className="summary-item-lbl">Garbage Reference ID:</span>
              <strong className="summary-item-val">{garbageId}</strong>
            </div>
            <div className="summary-item-row">
              <span className="summary-item-lbl">Estimated Weight:</span>
              <strong className="summary-item-val">{weight} Kg</strong>
            </div>
            <div className="summary-item-row">
              <span className="summary-item-lbl">Rate per Kg:</span>
              <strong className="summary-item-val">Rs. {ratePerKg}.00</strong>
            </div>
            <hr className="summary-divider" />
            <div className="summary-total-row">
              <span className="total-title">Total Service Charge:</span>
              <strong className="total-val">Rs. {amount}.00</strong>
            </div>
          </div>
        ) : (
          <div className="schedule-alert-msg">
            No payment details available. Please go back and try again.
          </div>
        )}

        {error && <p className="form-error-lbl" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        {successMessage && <p className="success-message" style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--eco-green)', fontWeight: '600' }}>{successMessage}</p>}

        <div className="schedule-actions-footer">
          <button
            type="button"
            className="wizard-back-btn"
            onClick={() => navigate('/addgarbageDetails')}
          >
            <i className="bx bx-left-arrow-alt"></i>
            <span>Back</span>
          </button>
          <button className="schedule-confirm-btn" onClick={handleAddPayment} disabled={!garbageId || !amount}>
            <span>Proceed to Payment</span>
            <i className="bx bx-credit-card"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatePayment;
