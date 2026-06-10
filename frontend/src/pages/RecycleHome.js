import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecycleHome.css';
import sellimg1 from '../photos/recycle1.png';
import sellimg2 from '../photos/recycle2.png';

const Home = () => {
    const navigate = useNavigate();

    const handleRecycle = () => {
        navigate("/recycle-management");
    };

    const handleHistory = () => {
        navigate("/recycle-history");
    };

    return (
        <div className="recycle-hub-container">
            {/* Back Navigation */}
            <button className="hub-back-btn" onClick={() => navigate('/UserHome')}>
                <i className="bx bx-left-arrow-alt"></i> Back to Dashboard
            </button>
            {/* Hub Header */}
            <div className="hub-welcome">
                <h2>Recycle Hub</h2>
                <p>Track your recycling transactions, log recyclable garbage items, and review earnings.</p>
            </div>

            {/* Quick Navigation Cards */}
            <div className="hub-cards-grid">
                <div className="hub-card" onClick={handleRecycle}>
                    <div className="hub-card-img-wrapper">
                        <img src={sellimg1} alt="Recycle Schedule" />
                        <div className="hub-card-icon bg-green">
                            <i className="bx bx-calendar-plus"></i>
                        </div>
                    </div>
                    <div className="hub-card-content">
                        <h3>Make a Schedule</h3>
                        <p>Schedule a collection to exchange your cardboards, newspapers, plastics, and metals for cash payouts.</p>
                        <button className="hub-card-btn font-green">
                            Schedule Now <i className="bx bx-right-arrow-alt"></i>
                        </button>
                    </div>
                </div>

                <div className="hub-card" onClick={handleHistory}>
                    <div className="hub-card-img-wrapper">
                        <img src={sellimg2} alt="Recycle History" />
                        <div className="hub-card-icon bg-blue">
                            <i className="bx bx-history"></i>
                        </div>
                    </div>
                    <div className="hub-card-content">
                        <h3>View Recycle History</h3>
                        <p>Explore your completed collections, weight breakdown, carbon savings metrics, and invoice statements.</p>
                        <button className="hub-card-btn font-blue">
                            View History <i className="bx bx-right-arrow-alt"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Acceptable Materials Reference Guide */}
            <div className="materials-guide-section">
                <h3>Recyclable Categories & Rates</h3>
                <div className="materials-grid">
                    <div className="material-rate-card border-cardboard">
                        <div className="rate-icon bg-orange">
                            <i className="bx bx-package"></i>
                        </div>
                        <h4>Cardboard</h4>
                        <p className="rate-value">54.00 LKR / kg</p>
                        <span className="rate-tag">Flattened & Dry</span>
                    </div>

                    <div className="material-rate-card border-news">
                        <div className="rate-icon bg-blue">
                            <i className="bx bx-news"></i>
                        </div>
                        <h4>Newspaper</h4>
                        <p className="rate-value">20.00 LKR / kg</p>
                        <span className="rate-tag">Bundled Sheets</span>
                    </div>

                    <div className="material-rate-card border-plastic">
                        <div className="rate-icon bg-green">
                            <i className="bx bx-droplet"></i>
                        </div>
                        <h4>Plastics / Cans</h4>
                        <p className="rate-value">98.00 LKR / kg</p>
                        <span className="rate-tag">PET & Aluminium</span>
                    </div>

                    <div className="material-rate-card border-metal">
                        <div className="rate-icon bg-purple">
                            <i className="bx bx-wrench"></i>
                        </div>
                        <h4>Metals / Scrap</h4>
                        <p className="rate-value">124.00 LKR / kg</p>
                        <span className="rate-tag">Steel & Iron</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
