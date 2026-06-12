import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/UpdateSchedule.css';

const UpdateSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scheduleId, address: initialAddress, district: initialDistrict, dateTime: initialDateTime } = location.state || {};
  const [address, setAddress] = useState(initialAddress || '');
  const [district, setDistrict] = useState(initialDistrict || '');
  const [dateTime, setDateTime] = useState(initialDateTime || '');

  const districts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mulaitivu",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Polonnaruwa",
    "Anuradhapura",
    "Kurunegala",
    "Kegalle",
    "Ratnapura"
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8070/schedule/updateschedule/${scheduleId}`, {
        address,
        district,
        dateTime,
      });
  
      alert("Schedule updated successfully!");
  
      navigate("/confirm", { 
        state: { 
          scheduleId, 
          address, 
          district, 
          dateTime 
        } 
      });
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule. Please try again.");
    }
  };

  return (
    <div className="recycle-workspace">
      <div className="schedule-card-container">
        <div className="schedule-card-header">
          <h3>Update Schedule Details</h3>
          <p className="schedule-card-subtitle">Modify your pickup address, district, or date and time slot.</p>
        </div>

        <form className="schedule-form-modern" onSubmit={handleUpdate}>
          <div className="form-group-modern">
            <label htmlFor="address">
              <i className="bx bx-map"></i> Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter your street address, building number..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required 
            />
          </div>

          <div className="form-row-grid">
            <div className="form-group-modern">
              <label htmlFor="district">
                <i className="bx bx-map-pin"></i> District
              </label>
              <div className="select-wrapper">
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-modern">
              <label htmlFor="dateTime">
                <i className="bx bx-time-five"></i> Date and Time Slot
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="schedule-actions-footer">
            <button 
              type="button" 
              className="wizard-back-btn" 
              onClick={() => navigate("/confirm", { state: { scheduleId, address, district, dateTime } })}
            >
              <i className="bx bx-left-arrow-alt"></i>
              <span>Cancel</span>
            </button>
            <button type="submit" className="schedule-confirm-btn">
              <span>Save Changes</span>
              <i className="bx bx-save"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSchedule;
