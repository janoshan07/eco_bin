import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProgressBar from './ProgressBar';
import '../styles/ScheduleCollection.css';
import moment from 'moment-timezone'; // Import moment for precise time handling

const ScheduleCollection = ({ userName: propUserName, userEmail: propUserEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Location State:', location.state);
  const stateData = location.state || {};
  const { items, totalWeight = 0, totalPrice = 0, paymentMethod = 'Cash' } = stateData;
  const userName = stateData.userName || propUserName || localStorage.getItem('userName') || '';
  const userEmail = stateData.userEmail || propUserEmail || localStorage.getItem('userEmail') || '';

  const serviceFee = 20.0;
  const toReceive = (totalPrice - serviceFee).toFixed(2);

  // Local state for Address, District, and Date-Time
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helper function to format the date and time without conversion
  const formatDateTime = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss'); // Format as local date and time
  };

  // Handle form submission
  const handleConfirm = async () => {
    if (!items || totalPrice === undefined || totalWeight === undefined) {
      console.error('Required data is missing');
      alert('Something went wrong. Please go back and try again.');
      return;
    }

    // Log the data before sending to the backend
    console.log('Data to be sent:', {
      userName,
      userEmail,
      items,
      totalWeight,
      totalPrice,
      paymentType: paymentMethod,
      toReceive,
      address,
      district,
      dateTime: formatDateTime(selectedDate), // Use formatted local date and time
    });

    // Data to be sent to the backend
    const collectionData = {
      userName,
      userEmail,
      items: Object.entries(items)
        .filter(([, itemData]) => itemData.selected)
        .map(([itemName, itemData]) => ({
          itemName,
          weight: itemData.weight.toFixed(1),
          total: itemData.total.toFixed(2),
        })),
      totalWeight: totalWeight.toFixed(1),
      totalPrice: totalPrice.toFixed(2),
      paymentType: paymentMethod,
      toReceive: Math.max(totalPrice - serviceFee, 0).toFixed(2),
      address,
      district,
      dateTime: formatDateTime(selectedDate), // Store formatted local date and time
    };

    try {
      const response = await fetch('http://localhost:8070/api/recycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });

      if (response.ok) {
        navigate('/success', {
          state: { toReceive, paymentMethod },
        });
      } else {
        alert('Failed to schedule collection. Please try again.');
      }
    } catch (error) {
      console.error('Error scheduling collection:', error);
      alert('An error occurred while scheduling the collection.');
    }
  };

  return (
    <div className="recycle-workspace">
      <ProgressBar activeStep={3} />
      
      <div className="schedule-card-container">
        <div className="schedule-card-header">
          <h3>Schedule Collection Slot</h3>
          <p className="schedule-card-subtitle">Provide your collection address and select a convenient date and time.</p>
        </div>

        <div className="schedule-form-modern">
          <div className="form-group-modern">
            <label htmlFor="address-input">
              <i className="bx bx-map"></i> Address
            </label>
            <input
              id="address-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your street address, building, city"
            />
          </div>

          <div className="form-row-grid">
            <div className="form-group-modern">
              <label htmlFor="district-select">
                <i className="bx bx-map-pin"></i> District
              </label>
              <div className="select-wrapper">
                <select id="district-select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="">Select District</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Matale">Matale</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Galle">Galle</option>
                  <option value="Matara">Matara</option>
                  <option value="Hambantota">Hambantota</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Kilinochchi">Kilinochchi</option>
                  <option value="Mannar">Mannar</option>
                  <option value="Vavuniya">Vavuniya</option>
                  <option value="Mullaitivu">Mullaitivu</option>
                  <option value="Trincomalee">Trincomalee</option>
                  <option value="Batticaloa">Batticaloa</option>
                  <option value="Ampara">Ampara</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Puttalam">Puttalam</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Polonnaruwa">Polonnaruwa</option>
                  <option value="Badulla">Badulla</option>
                  <option value="Monaragala">Monaragala</option>
                  <option value="Ratnapura">Ratnapura</option>
                  <option value="Kegalle">Kegalle</option>
                </select>
              </div>
            </div>

            <div className="form-group-modern">
              <label htmlFor="date-picker-input">
                <i className="bx bx-time-five"></i> Preferred Date & Time
              </label>
              <div className="datepicker-wrapper">
                <DatePicker
                  id="date-picker-input"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="date-picker"
                />
              </div>
            </div>
          </div>

          <div className="schedule-actions-footer">
            <button
              type="button"
              className="wizard-back-btn"
              onClick={() =>
                navigate('/summary', {
                  state: { items, totalWeight, totalPrice, userName, userEmail, paymentMethod }
                })
              }
            >
              <i className="bx bx-left-arrow-alt"></i>
              <span>Back</span>
            </button>
            <button className="schedule-confirm-btn" onClick={handleConfirm}>
              <span>Confirm Pickup Slot</span>
              <i className="bx bx-calendar-check"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCollection;
