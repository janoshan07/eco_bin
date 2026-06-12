import React, { useState } from 'react';
import '../styles/GarbageDetails.css';
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const GarbageDetails = () => {
  const notify = useNotification(); 
  const navigate = useNavigate();

  // State management for the form fields
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    type: '',
    weight: '',
    additionalNotes: ''
  });

  // State for error messages
  const [errors, setErrors] = useState({
    contactNumber: '',
    weight: '',
    form: ''
  });

  // State for success message
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation logic for contactNumber
    if (name === 'contactNumber') {
      if (/^\d*$/.test(value) && value.length <= 10) { 
        setErrors((prevErrors) => ({
          ...prevErrors,
          contactNumber: ''
        }));
        setFormData((prevData) => ({
          ...prevData,
          contactNumber: value
        }));
      } else if (value.length > 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          contactNumber: 'Contact number must be 10 digits long'
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          contactNumber: 'Contact number must be an integer'
        }));
      }
    }

    // Validation logic for weight
    if (name === 'weight') {
      if (/^\d*$/.test(value) && Number(value) > 0) { // Allow only digits and must be greater than 0
        setErrors((prevErrors) => ({
          ...prevErrors,
          weight: ''
        }));
        setFormData((prevData) => ({
          ...prevData,
          weight: value
        }));
      } else if (value === '') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          weight: ''
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          weight: 'Weight must be a positive integer greater than 0'
        }));
      }
    }

    // Update the remaining form fields without validation
    if (name !== 'contactNumber' && name !== 'weight') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setErrors({ contactNumber: '', weight: '', form: '' });
    setSuccessMessage('');
  
    // Check if all fields are filled
    for (const key in formData) {
      if (!formData[key]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: 'All fields are required',
        }));
        setIsSubmitting(false);
        return;
      }
    }
  
    const payload = {
      ...formData,
      contactNumber: Number(formData.contactNumber),
      weight: Number(formData.weight),
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8070/garbage/addgarbageDetails",
        payload
      );
  
      const { garbageId } = response.data; // Get the garbageId from the response
  
      console.log("Navigating with", garbageId, formData.weight);
      navigate('/addpaymentdetails', {
        state: { garbageId, weight: formData.weight },
      });
  
      setFormData({
        name: '',
        contactNumber: '',
        type: '',
        weight: '',
        additionalNotes: '',
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        notify("Error: " + error.response.data.error);
      } else if (error.request) {
        notify("Network error: Unable to reach the server. Please try again later.");
      } else {
        notify("An error occurred while submitting the form. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="recycle-workspace">
      <div className="schedule-card-container">
        <div className="schedule-card-header">
          <h3>Special Garbage Details</h3>
          <p className="schedule-card-subtitle">Provide contact information, waste category, and estimated weight for the special pickup.</p>
        </div>

        {errors.form && <div className="schedule-alert-msg">{errors.form}</div>}
        {successMessage && <div className="success-message" style={{ color: 'var(--eco-green)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '600' }}>{successMessage}</div>}

        <form onSubmit={handleSubmit} className="schedule-form-modern">
          <div className="form-row-grid">
            <div className="form-group-modern">
              <label htmlFor="name">
                <i className="bx bx-user"></i> Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-modern">
              <label htmlFor="contact">
                <i className="bx bx-phone"></i> Contact Number
              </label>
              <input
                type="text"
                id="contact"
                name="contactNumber"
                placeholder="e.g. 0771234567"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
              {errors.contactNumber && <p className="form-error-lbl">{errors.contactNumber}</p>}
            </div>
          </div>

          <div className="form-row-grid">
            <div className="form-group-modern">
              <label htmlFor="type">
                <i className="bx bx-category"></i> Waste Type
              </label>
              <div className="select-wrapper">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Waste Type</option>
                  <option value="heavy-garden-waste">Heavy Garden Waste</option>
                  <option value="organic-waste">Organic Waste</option>
                  <option value="electronic-waste">Electronic Waste</option>
                  <option value="medical-waste">Medical and Biomedical Waste</option>
                  <option value="industrial-waste">Industrial Waste</option>
                  <option value="agricultural-waste">Agricultural Waste</option>
                  <option value="chemical-waste">Chemical Waste</option>
                </select>
              </div>
            </div>

            <div className="form-group-modern">
              <label htmlFor="weight">
                <i className="bx bx-grid-alt"></i> Weight (Kg)
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                placeholder="Enter weight in kg"
                value={formData.weight}
                onChange={handleChange}
                required
              />
              {errors.weight && <p className="form-error-lbl">{errors.weight}</p>}
            </div>
          </div>

          <div className="form-group-modern">
            <label htmlFor="notes">
              <i className="bx bx-note"></i> Additional Notes
            </label>
            <textarea
              id="notes"
              name="additionalNotes"
              placeholder="Specify any special handling instructions..."
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </div>

          <div className="schedule-actions-footer">
            <button type="button" className="wizard-back-btn" onClick={() => navigate('/confirm')}>
              <i className="bx bx-left-arrow-alt"></i>
              <span>Back</span>
            </button>
            <button type="submit" className="schedule-confirm-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? "Submitting..." : "Continue"}</span>
              <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GarbageDetails;
