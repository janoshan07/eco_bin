import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/styles/CompostActions.css';
import compostOrderImg from '../../photos/compost_order.png';
import compostHistoryImg from '../../photos/compost_history.png';

const CompostActions = () => {
    const navigate = useNavigate();

    const goToAddCompostRequest = () => {
        navigate('/addCompostRequest');
    };

    const goToMyCompostRequests = () => {
        navigate('/myCompostRequest');
    };

    return (
        <div className="recycle-hub-container">
            {/* Back Navigation */}
            <button className="hub-back-btn" onClick={() => navigate('/UserHome')}>
                <i className="bx bx-left-arrow-alt"></i> Back to Dashboard
            </button>

            {/* Hub Header */}
            <div className="hub-welcome">
                <h2>Compost Store</h2>
                <p>Request organic compost fertilizer produced from recycled biodegradable waste or view your request statuses.</p>
            </div>

            {/* Quick Navigation Cards */}
            <div className="hub-cards-grid">
                <div className="hub-card" onClick={goToAddCompostRequest}>
                    <div className="hub-card-img-wrapper">
                        <img src={compostOrderImg} alt="Add Compost Request" />
                        <div className="hub-card-icon bg-green">
                            <i className="bx bx-plus-circle"></i>
                        </div>
                    </div>
                    <div className="hub-card-content">
                        <h3>Add Compost Request</h3>
                        <p>Submit a request to order organic fertilizers, specify the quantity, and choose your preferred delivery details.</p>
                        <button className="hub-card-btn font-green">
                            Submit Request <i className="bx bx-right-arrow-alt"></i>
                        </button>
                    </div>
                </div>

                <div className="hub-card" onClick={goToMyCompostRequests}>
                    <div className="hub-card-img-wrapper">
                        <img src={compostHistoryImg} alt="My Compost Requests" />
                        <div className="hub-card-icon bg-blue">
                            <i className="bx bx-list-ul"></i>
                        </div>
                    </div>
                    <div className="hub-card-content">
                        <h3>My Compost Requests</h3>
                        <p>Track your ongoing orders, check review approvals, dispatch status, and billing details of past requests.</p>
                        <button className="hub-card-btn font-blue">
                            View Requests <i className="bx bx-right-arrow-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompostActions;

