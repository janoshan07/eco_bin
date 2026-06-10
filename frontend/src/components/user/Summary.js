import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Summary.css';
import ProgressBar from './ProgressBar';

const Summary = ({ userName: propUserName, userEmail: propUserEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};
  const items = stateData.items || {};
  const totalWeight = stateData.totalWeight || 0;
  const totalPrice = stateData.totalPrice || 0;
  const userName = stateData.userName || propUserName || localStorage.getItem('userName') || '';
  const userEmail = stateData.userEmail || propUserEmail || localStorage.getItem('userEmail') || '';

  const serviceFee = 20.0; // Fixed service fee
  const toReceive = (totalPrice - serviceFee).toFixed(2);

  // State for storing the selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');

  // Handle radio button change for payment method
  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleNextClick = () => {
    // Pass userName and userEmail to ScheduleCollection
    navigate('/schedule-collection', {
      state: {
        items,
        totalWeight,
        totalPrice,
        paymentMethod: selectedPaymentMethod, // Make sure this is correctly defined
        userName,
        userEmail,
      },
    });
  };
  
  

  return (
    <div className="recycle-workspace">
      <ProgressBar activeStep={2} />
      <div className="summary-card-container">
        <div className="summary-card-header">
          <h3>Review Details & Fee</h3>
          <p className="summary-card-subtitle">Verify your selected materials, service fees, and select your collection method.</p>
        </div>

        <div className="summary-split-layout">
          <div className="summary-items-column">
            <h4>Recyclable Items Summary</h4>
            <div className="summary-table-card">
              <div className="table-header-row">
                <span>Material</span>
                <span>Weight</span>
                <span>Est. Value</span>
              </div>
              
              <div className="table-body-rows">
                {Object.entries(items).map(
                  ([itemName, itemData]) =>
                    itemData.selected && (
                      <div key={itemName} className="summary-item-row">
                        <span className="material-name-lbl">{itemName.charAt(0).toUpperCase() + itemName.slice(1)}</span>
                        <span>{itemData.weight.toFixed(1)} kg</span>
                        <span className="material-price-val">Rs. {itemData.total.toFixed(2)}</span>
                      </div>
                    )
                )}
              </div>

              <div className="summary-totals-section">
                <div className="totals-row">
                  <span>Total Weight & Value</span>
                  <span>{totalWeight.toFixed(1)} kg</span>
                  <span>Rs. {totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="totals-row service-fee-row">
                  <span>Platform Service Fee</span>
                  <span></span>
                  <span>- Rs. {serviceFee.toFixed(2)}</span>
                </div>
                
                <div className="totals-row net-receive-row">
                  <span>Estimated Payout</span>
                  <span></span>
                  <span className="net-receive-val">Rs. {toReceive}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-method-column">
            <h4>Select Collection Method</h4>
            <div className="payment-options-grid">
              <div 
                className={`payment-card-option ${selectedPaymentMethod === 'Cash' ? 'active' : ''}`}
                onClick={() => setSelectedPaymentMethod('Cash')}
              >
                <input
                  type="radio"
                  id="cash"
                  name="payment-method"
                  value="Cash"
                  checked={selectedPaymentMethod === 'Cash'}
                  onChange={handlePaymentMethodChange}
                  style={{ display: 'none' }}
                />
                <div className="payment-card-icon">
                  <i className="bx bx-wallet"></i>
                </div>
                <div className="payment-card-info">
                  <h5>Cash Payment</h5>
                  <p>Collect cash payout directly from the collection driver.</p>
                </div>
                <div className="payment-card-check">
                  <div className="check-dot"></div>
                </div>
              </div>

              <div 
                className={`payment-card-option ${selectedPaymentMethod === 'PayCheck' ? 'active' : ''}`}
                onClick={() => setSelectedPaymentMethod('PayCheck')}
              >
                <input
                  type="radio"
                  id="paycheck"
                  name="payment-method"
                  value="PayCheck"
                  checked={selectedPaymentMethod === 'PayCheck'}
                  onChange={handlePaymentMethodChange}
                  style={{ display: 'none' }}
                />
                <div className="payment-card-icon">
                  <i className="bx bx-file-blank"></i>
                </div>
                <div className="payment-card-info">
                  <h5>Bank PayCheck</h5>
                  <p>Receive a bank paycheck mailed to your address.</p>
                </div>
                <div className="payment-card-check">
                  <div className="check-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="summary-actions-footer">
          <button className="wizard-back-btn" onClick={() => navigate('/recycle-management')}>
            <i className="bx bx-left-arrow-alt"></i>
            <span>Back</span>
          </button>
          <button className="summary-next-btn" onClick={handleNextClick}>
            <span>Continue</span>
            <i className="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
