import React, { useState } from 'react';
import '../styles/Schedule.css';
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
    const navigate = useNavigate();
    
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!address) newErrors.address = 'Address is required.';
        if (!district) newErrors.district = 'District is required.';
        if (!dateTime) newErrors.dateTime = 'Date and Time are required.';
        else {
            const selectedDateTime = new Date(dateTime);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDateTime < today) {
                newErrors.dateTime = 'You can only select today or future dates.';
            }

            const selectedHours = selectedDateTime.getHours();
            if (selectedHours < 8 || selectedHours >= 17) {
                newErrors.dateTime = 'Please select your time between 8:00 AM - 5:00 PM.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        const localDateTime = new Date(dateTime);
        const dateTimeUTC = new Date(localDateTime.getTime() - (localDateTime.getTimezoneOffset() * 60000)).toISOString();

        const newSchedule = {
            address,
            district,
            dateTime: dateTimeUTC,
        };

        try {
            const response = await fetch('http://localhost:8070/schedule/addschedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSchedule),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Failed to add schedule. Please try again.');
            }

            const result = await response.json();
            navigate('/confirm', { state: { scheduleId: result.scheduleId, address, district, dateTime } });
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="recycle-workspace">
            <div className="schedule-card-container">
                <div className="schedule-card-header">
                    <h3>Schedule Collection Time Slot</h3>
                    <p className="schedule-card-subtitle">Provide your pickup address details and pick a convenient date & time slot for collection.</p>
                </div>
                
                {message && <div className="schedule-alert-msg">{message}</div>}
                
                <form onSubmit={handleSubmit} className="schedule-form-modern">
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
                        {errors.address && <p className="form-error-lbl">{errors.address}</p>}
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
                                    <option value="Gampaha">Gampaha</option>
                                    <option value="Colombo">Colombo</option>
                                    <option value="Kaluthara">Kaluthara</option>
                                    <option value="Kandy">Kandy</option>
                                    <option value="Matale">Matale</option>
                                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                                    <option value="Galle">Galle</option>
                                    <option value="Hambantota">Hambantota</option>
                                    <option value="Matara">Matara</option>
                                    <option value="Jaffna">Jaffna</option>
                                    <option value="Kilinochchi">Kilinochchi</option>
                                    <option value="Mannar">Mannar</option>
                                    <option value="Vavuniya">Vavuniya</option>
                                    <option value="Mullaitivu">Mullaitivu</option>
                                    <option value="Batticaloa">Batticaloa</option>
                                    <option value="Ampara">Ampara</option>
                                    <option value="Trincomalee">Trincomalee</option>
                                    <option value="Polonnaruwa">Polonnaruwa</option>
                                    <option value="Anuradhapura">Anuradhapura</option>
                                    <option value="Kurunegala">Kurunegala</option>
                                    <option value="Puttalam">Puttalam</option>
                                    <option value="Kegalle">Kegalle</option>
                                    <option value="Ratnapura">Ratnapura</option>
                                    <option value="Badulla">Badulla</option>
                                    <option value="Monaragala">Monaragala</option>
                                </select>
                            </div>
                            {errors.district && <p className="form-error-lbl">{errors.district}</p>}
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
                                min={new Date().toISOString().slice(0, 16)}
                                required
                            />
                            <span className="form-tip-lbl">Available hours: 8:00 AM - 5:00 PM daily</span>
                            {errors.dateTime && <p className="form-error-lbl">{errors.dateTime}</p>}
                        </div>
                    </div>

                    <div className="schedule-actions-footer">
                        <button type="button" className="wizard-back-btn" onClick={() => navigate('/UserHome')}>
                            <i className="bx bx-left-arrow-alt"></i>
                            <span>Back</span>
                        </button>
                        <button type="submit" className="schedule-confirm-btn" disabled={isSubmitting}>
                            <span>{isSubmitting ? "Processing..." : "Continue"}</span>
                            <i className="bx bx-right-arrow-alt"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Schedule;
