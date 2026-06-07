import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/CompostActions.css';

const CompostActions = () => {
    const navigate = useNavigate();

    const goToAddCompostRequest = () => {
        navigate('/addCompostRequest');
    };

    const goToMyCompostRequests = () => {
        navigate('/myCompostRequest');
    };

    return (
        <div className="compost-hub-wrapper">
            <div className="compost-hub-header">
                <h2>Compost Store Workspace</h2>
                <p>Request organic compost fertilizer produced from recycled biodegradable waste or view your request statuses.</p>
            </div>

            <div className="compost-cards-grid">
                <div className="compost-card-box" onClick={goToAddCompostRequest}>
                    <div className="compost-icon-circle bg-green">
                        <i className="bx bx-plus-circle"></i>
                    </div>
                    <h3>Add Compost Request</h3>
                    <p>Submit a request to order organic fertilizers, specify the quantity, and choose your preferred delivery details.</p>
                    <button className="compost-btn font-green">
                        Submit Request <i className="bx bx-right-arrow-alt"></i>
                    </button>
                </div>

                <div className="compost-card-box" onClick={goToMyCompostRequests}>
                    <div className="compost-icon-circle bg-blue">
                        <i className="bx bx-list-ul"></i>
                    </div>
                    <h3>My Compost Requests</h3>
                    <p>Track your ongoing orders, check review approvals, dispatch status, and billing details of past requests.</p>
                    <button className="compost-btn font-blue">
                        View Requests <i className="bx bx-right-arrow-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompostActions;
