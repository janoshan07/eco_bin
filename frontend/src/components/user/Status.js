import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Status.css';

const Status = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentMethod, paymentStatus, amount } = location.state || {};

  const handleBackToHome = () => {
    navigate('/UserHome'); 
  };

  return (
    <div className="recycle-workspace status-viewport">
      <div className="schedule-card-container status-card">
        <div className="status-icon-wrapper">
          <i className="bx bx-check-circle"></i>
        </div>
        <div className="schedule-card-header status-header">
          <h3>Collection Scheduled Successfully!</h3>
          <p className="schedule-card-subtitle">Your pickup reference has been registered on our system.</p>
        </div>

        <div className="status-details-box">
          <div className="status-detail-row">
            <span className="status-detail-lbl">Payment Method:</span>
            <strong className="status-detail-val">{paymentMethod || 'N/A'}</strong>
          </div>
          <div className="status-detail-row">
            <span className="status-detail-lbl">Payment Status:</span>
            <strong className={`status-detail-val status-tag ${paymentStatus === 'completed' ? 'completed' : 'pending'}`}>
              {paymentStatus || 'N/A'}
            </strong>
          </div>
          <div className="status-detail-row">
            <span className="status-detail-lbl">Total Amount:</span>
            <strong className="status-detail-val">Rs. {amount || 0}.00</strong>
          </div>
        </div>

        <button onClick={handleBackToHome} className="schedule-confirm-btn status-ok-btn">
          <span>Return to Dashboard</span>
          <i className="bx bx-home-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default Status;
