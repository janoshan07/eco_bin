import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/ConfirmCollection.css';

const ConfirmCollection = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { scheduleId, address, district, dateTime } = location.state || {}; // Get scheduleId from state

  // Handle delete schedule
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to cancel this scheduled pickup slot?")) return;
    try {
      await axios.delete(`http://localhost:8070/schedule/deleteschedule/${scheduleId}`);
      alert("Schedule deleted successfully!");
      navigate("/addschedule"); 
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("Failed to delete schedule. Please try again.");
    }
  };

  // Handle update schedule - redirect to the update page
  const handleUpdate = () => {
    if (scheduleId) {
      navigate(`/update-schedule/${scheduleId}`, { 
        state: { scheduleId, address, district, dateTime } 
      });
    } else {
      alert("Schedule ID is missing.");
    }
  };

  // Handle confirm button click - navigate to the addgarbageDetails page
  const handleConfirm = () => {
    navigate("/addgarbageDetails");
  };

  return (
    <div className="recycle-workspace">
      <div className="schedule-card-container">
        <div className="schedule-card-header">
          <h3>Confirm Your Collection Details</h3>
          <p className="schedule-card-subtitle">Verify your scheduled pickup location and time slot before proceeding.</p>
        </div>

        {scheduleId ? (
          <div className="confirm-details-section">
            <div className="confirm-details-card">
              <div className="detail-item">
                <i className="bx bx-map"></i>
                <div>
                  <strong>Address</strong>
                  <p>{address || 'N/A'}</p>
                </div>
              </div>
              <div className="detail-item">
                <i className="bx bx-map-pin"></i>
                <div>
                  <strong>District</strong>
                  <p>{district || 'N/A'}</p>
                </div>
              </div>
              <div className="detail-item">
                <i className="bx bx-calendar"></i>
                <div>
                  <strong>Date</strong>
                  <p>{dateTime ? new Date(dateTime).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="detail-item">
                <i className="bx bx-time-five"></i>
                <div>
                  <strong>Time</strong>
                  <p>{dateTime ? new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="confirm-actions-sidebar">
              <h4>Options</h4>
              <button className="option-action-btn edit" onClick={handleUpdate}>
                <i className="bx bx-edit"></i> Edit Details
              </button>
              <button className="option-action-btn delete" onClick={handleDelete}>
                <i className="bx bx-trash"></i> Cancel Slot
              </button>
            </div>
          </div>
        ) : (
          <div className="schedule-alert-msg">
            No schedule details available. Please go back and schedule a slot.
          </div>
        )}

        <div className="schedule-actions-footer">
          <button className="wizard-back-btn" onClick={() => navigate('/addschedule')}>
            <i className="bx bx-left-arrow-alt"></i>
            <span>Back</span>
          </button>
          <button className="schedule-confirm-btn" onClick={handleConfirm} disabled={!scheduleId}>
            <span>Confirm & Continue</span>
            <i className="bx bx-check-double"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCollection;
