import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/UserDashboardLayout.css'; 
import logo from '../../Assets/logo.png';
import Footer from '../Footer';

function UserDashboardLayout({ children, userName, userEmail, activeTab }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [localUserName, setLocalUserName] = useState(userName || "");
    const [localUserEmail, setLocalUserEmail] = useState(userEmail || localStorage.getItem('userEmail') || "");

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8070/api/auth/user', {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                if (response.data) {
                    setLocalUserName(response.data.name);
                    setLocalUserEmail(response.data.email);
                }
            } catch (error) {
                console.error('Failed to fetch user data inside Layout', error);
            }
        };

        if (!localUserName) {
            fetchUserData();
        }
    }, [localUserName]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar Navigation */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <img src={logo} alt="EcoBin Logo" className="brand-logo-img" />
                    <span className="brand-name">EcoBin</span>
                </div>

                <div className="sidebar-nav-container">
                    <div className="sidebar-nav-list">
                        <div className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
                            <Link to="/UserHome">
                                <i className="bx bxs-dashboard"></i>
                                <span>Dashboard</span>
                            </Link>
                        </div>
                        <div className={`sidebar-nav-item ${activeTab === 'recycle' ? 'active' : ''}`}>
                            <Link to="/recyclehome">
                                <i className="bx bx-recycle"></i>
                                <span>Recycle Hub</span>
                            </Link>
                        </div>
                        <div className={`sidebar-nav-item ${activeTab === 'pickup' ? 'active' : ''}`}>
                            <Link to="/addschedule">
                                <i className="bx bx-calendar-event"></i>
                                <span>Schedule Pickup</span>
                            </Link>
                        </div>
                        <div className={`sidebar-nav-item ${activeTab === 'compost' ? 'active' : ''}`}>
                            <Link to="/Compost-Actions">
                                <i className="bx bxs-leaf"></i>
                                <span>Compost Store</span>
                            </Link>
                        </div>
                        <div className={`sidebar-nav-item ${activeTab === 'garbage' ? 'active' : ''}`}>
                            <Link to="/Garbage-Actions">
                                <i className="bx bxs-truck"></i>
                                <span>Waste Collection</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Promotional/Motivational Card Widget in Sidebar */}
                <div className="sidebar-promo-card">
                    <div className="promo-icon">
                        <i className="bx bx-world"></i>
                    </div>
                    <h4>Go Green!</h4>
                    <p>Every piece of waste you recycle helps conserve energy and reduce greenhouse gases.</p>
                    <div className="promo-progress">
                        <div className="promo-progress-bar" style={{ width: "75%" }}></div>
                    </div>
                    <span className="promo-lbl">75% City Goal Achieved</span>
                </div>

                <div className="sidebar-footer">
                    <button className="sidebar-logout-btn" onClick={handleLogout}>
                        <i className="bx bx-log-out"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-welcome">
                        <h1>EcoBin Workspace</h1>
                        <p>View stats, forms, and operations in real-time.</p>
                    </div>

                    <div className="header-controls">
                        <div className="header-search">
                            <i className="bx bx-search"></i>
                            <input 
                                type="text" 
                                placeholder="Search workspace..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="header-icon-btn notification-bell">
                            <i className="bx bxs-bell"></i>
                            <span className="bell-badge"></span>
                        </div>

                        <div className="header-profile">
                            <div className="profile-avatar">
                                <span>{(localUserName && localUserName.charAt(0).toUpperCase()) || "U"}</span>
                            </div>
                            <div className="profile-details">
                                <span className="profile-name">{localUserName || "Eco Citizen"}</span>
                                <span className="profile-email">{localUserEmail || "user@ecobin.lk"}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main page content injection */}
                <div className="dashboard-content-body">
                    {children}
                </div>

                <div className="dashboard-footer-wrapper">
                    <Footer />
                </div>
            </main>
        </div>
    );
}

export default UserDashboardLayout;
