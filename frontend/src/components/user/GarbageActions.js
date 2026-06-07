import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/GarbageActions.css';

const GarbageActions = () => {
    const navigate = useNavigate();

    const handleAddWaste = () => {
        navigate('/addwaste-user');
    };

    const handleMyWasteDetails = () => {
        navigate('/userwastedetails');
    };

    return (
        <div className="garbage-hub-wrapper">
            <div className="garbage-hub-header">
                <h2>Waste Collection Workspace</h2>
                <p>Register household waste details for pickup operations or view invoices and weight records of previous collections.</p>
            </div>

            <div className="garbage-cards-grid">
                <div className="garbage-card-box" onClick={handleAddWaste}>
                    <div className="garbage-icon-circle bg-purple">
                        <i className="bx bx-message-square-add"></i>
                    </div>
                    <h3>Add Waste Details</h3>
                    <p>Enter the type, estimated weight, and descriptions of waste items ready for collection center transfer.</p>
                    <button className="garbage-btn font-purple">
                        Register Waste <i className="bx bx-right-arrow-alt"></i>
                    </button>
                </div>

                <div className="garbage-card-box" onClick={handleMyWasteDetails}>
                    <div className="garbage-icon-circle bg-blue">
                        <i className="bx bx-receipt"></i>
                    </div>
                    <h3>My Added Waste Details</h3>
                    <p>Check the collection log, verify processed weights, view point balances, and print receipt records.</p>
                    <button className="garbage-btn font-blue">
                        View Log <i className="bx bx-right-arrow-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GarbageActions;
