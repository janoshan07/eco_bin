import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/UserHome.css'; 
import UserDashboardLayout from "./UserDashboardLayout";

function UserHome({ userName, userEmail }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <UserDashboardLayout userName={userName} userEmail={userEmail} activeTab="dashboard">
            {/* Dashboard Metrics Row */}
            <section className="metrics-section">
                <div className="metric-card card-blue">
                    <div className="metric-header">
                        <div className="metric-title">Total Recycled</div>
                        <div className="metric-icon-wrapper">
                            <i className="bx bx-recycle"></i>
                        </div>
                    </div>
                    <div className="metric-value">148.5 kg</div>
                    <div className="metric-footer text-blue">
                        <i className="bx bx-trending-up"></i>
                        <span>+15.2% vs last month</span>
                    </div>
                </div>

                <div className="metric-card card-green">
                    <div className="metric-header">
                        <div className="metric-title">Carbon Offset</div>
                        <div className="metric-icon-wrapper">
                            <i className="bx bx-cloud-light"></i>
                        </div>
                    </div>
                    <div className="metric-value">312.4 kg</div>
                    <div className="metric-footer text-green">
                        <i className="bx bx-trending-up"></i>
                        <span>+8.4% CO₂ saved</span>
                    </div>
                </div>

                <div className="metric-card card-orange">
                    <div className="metric-header">
                        <div className="metric-title">Scheduled Pickups</div>
                        <div className="metric-icon-wrapper">
                            <i className="bx bx-calendar"></i>
                        </div>
                    </div>
                    <div className="metric-value">3 Active</div>
                    <div className="metric-footer text-orange">
                        <i className="bx bx-time"></i>
                        <span>Next: June 12, 10:00 AM</span>
                    </div>
                </div>

                <div className="metric-card card-purple">
                    <div className="metric-header">
                        <div className="metric-title">Fertilizer Requests</div>
                        <div className="metric-icon-wrapper">
                            <i className="bx bx-package"></i>
                        </div>
                    </div>
                    <div className="metric-value">5 Orders</div>
                    <div className="metric-footer text-purple">
                        <i className="bx bx-check-circle"></i>
                        <span>2 Ready for Dispatch</span>
                    </div>
                </div>
            </section>

            {/* Quick Action Modules Section */}
            <section className="actions-section-new">
                <h2 className="section-title">Core Services</h2>
                <div className="actions-grid-new">
                    <div className="action-card-new">
                        <div className="action-card-icon bg-blue">
                            <i className="bx bx-recycle"></i>
                        </div>
                        <h3>Recycle Hub</h3>
                        <p>Calculate payouts, manage reusable garbage items, and review recycling metrics.</p>
                        <Link to="/recyclehome" className="action-card-btn font-blue">
                            Open Hub <i className="bx bx-right-arrow-alt"></i>
                        </Link>
                    </div>

                    <div className="action-card-new">
                        <div className="action-card-icon bg-orange">
                            <i className="bx bx-calendar-event"></i>
                        </div>
                        <h3>Schedule Pickup</h3>
                        <p>Book automated smart bin collections and specify your pickup location coordinates.</p>
                        <Link to="/addschedule" className="action-card-btn font-orange">
                            Book Pickup <i className="bx bx-right-arrow-alt"></i>
                        </Link>
                    </div>

                    <div className="action-card-new">
                        <div className="action-card-icon bg-green">
                            <i className="bx bxs-leaf"></i>
                        </div>
                        <h3>Compost Store</h3>
                        <p>Purchase high-quality organic fertilizer produced from local biodegradable waste.</p>
                        <Link to="/Compost-Actions" className="action-card-btn font-green">
                            Shop Fertilizer <i className="bx bx-right-arrow-alt"></i>
                        </Link>
                    </div>

                    <div className="action-card-new">
                        <div className="action-card-icon bg-purple">
                            <i className="bx bxs-truck"></i>
                        </div>
                        <h3>Waste Collection</h3>
                        <p>Hand over household garbage types to verified partners and print invoices.</p>
                        <Link to="/Garbage-Actions" className="action-card-btn font-purple">
                            Manage Handovers <i className="bx bx-right-arrow-alt"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Charts & Analytics Section */}
            <section className="analytics-section-new">
                <div className="analytics-grid-new">
                    {/* Line/Area Chart */}
                    <div className="analytics-card line-chart-card">
                        <div className="card-header-new">
                            <h3>Waste Collection Analytics</h3>
                            <div className="card-header-actions">
                                <span className="badge-time active">Weekly</span>
                                <span className="badge-time">Monthly</span>
                            </div>
                        </div>
                        <div className="chart-container-new">
                            {/* SVG Premium Area Chart */}
                            <svg viewBox="0 0 500 220" className="svg-chart">
                                <defs>
                                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                {/* Grid Lines */}
                                <line x1="40" y1="40" x2="480" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="40" y1="190" x2="480" y2="190" stroke="#e2e8f0" strokeWidth="1.5" />

                                {/* X-axis Labels */}
                                <text x="50" y="210" fill="#94a3b8" fontSize="11" textAnchor="middle">Mon</text>
                                <text x="120" y="210" fill="#94a3b8" fontSize="11" textAnchor="middle">Tue</text>
                                <text x="190" y="210" fill="#94a3b8" fontSize="11" textAnchor="middle">Wed</text>
                                <text x="260" y="210" fill="#94a3b8" fontSize="11" textAnchor="middle">Thu</text>
                                <text x="330" y="210" fill="#94a3b8" fontSize="11" textAnchor="middle">Fri</text>
                                <text x="400" y="210" fill="#94a3b8" fontSize="11" textAnchor="middle">Sat</text>
                                <text x="470" y="210" fill="#94a3b8" fontSize="11" textAnchor="middle">Sun</text>

                                {/* Y-axis Labels */}
                                <text x="25" y="44" fill="#94a3b8" fontSize="11" textAnchor="end">100kg</text>
                                <text x="25" y="94" fill="#94a3b8" fontSize="11" textAnchor="end">50kg</text>
                                <text x="25" y="144" fill="#94a3b8" fontSize="11" textAnchor="end">25kg</text>
                                <text x="25" y="194" fill="#94a3b8" fontSize="11" textAnchor="end">0kg</text>

                                {/* Line Area */}
                                <path d="M 50 160 Q 120 70 190 130 T 330 90 T 470 50 L 470 190 L 50 190 Z" fill="url(#chart-grad)" />
                                {/* The Line */}
                                <path d="M 50 160 Q 120 70 190 130 T 330 90 T 470 50" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />

                                {/* Data Points */}
                                <circle cx="50" cy="160" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                                <circle cx="120" cy="85" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                                <circle cx="190" cy="130" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                                <circle cx="260" cy="115" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                                <circle cx="330" cy="90" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                                <circle cx="400" cy="65" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                                <circle cx="470" cy="50" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="analytics-card donut-chart-card">
                        <div className="card-header-new">
                            <h3>Waste Composition</h3>
                        </div>
                        <div className="donut-container-new">
                            <div className="donut-visual">
                                <svg viewBox="0 0 150 150" className="svg-donut">
                                    {/* Gray Background Circle */}
                                    <circle cx="75" cy="75" r="55" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                                    
                                    {/* Segment 1: Green (Organic) - 55% */}
                                    <circle cx="75" cy="75" r="55" fill="transparent" stroke="#10B981" strokeWidth="18" 
                                        strokeDasharray="190 345.57" strokeDashoffset="0" />
                                        
                                    {/* Segment 2: Blue (Recyclable) - 30% */}
                                    <circle cx="75" cy="75" r="55" fill="transparent" stroke="#3B82F6" strokeWidth="18" 
                                        strokeDasharray="104 345.57" strokeDashoffset="-190" />

                                    {/* Segment 3: Orange (General) - 15% */}
                                    <circle cx="75" cy="75" r="55" fill="transparent" stroke="#F59E0B" strokeWidth="18" 
                                        strokeDasharray="52 345.57" strokeDashoffset="-294" />
                                </svg>
                                <div className="donut-center-text">
                                    <span className="donut-pct">85%</span>
                                    <span className="donut-lbl">Diverted</span>
                                </div>
                            </div>
                            <div className="donut-legend">
                                <div className="legend-item">
                                    <span className="dot bg-green"></span>
                                    <span className="name">Organic</span>
                                    <span className="val">55%</span>
                                </div>
                                <div className="legend-item">
                                    <span className="dot bg-blue"></span>
                                    <span className="name">Recyclables</span>
                                    <span className="val">30%</span>
                                </div>
                                <div className="legend-item">
                                    <span className="dot bg-orange"></span>
                                    <span className="name">General</span>
                                    <span className="val">15%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Table Section */}
            <section className="table-section-new">
                <div className="card-header-new">
                    <h3>Recent Pickup & Collection Bins</h3>
                    <Link to="/Garbage-Actions" className="table-header-link">View All Bins</Link>
                </div>
                <div className="table-container-new">
                    <table className="recent-table-new">
                        <thead>
                            <tr>
                                <th>Bin ID</th>
                                <th>Waste Category</th>
                                <th>Assigned Route</th>
                                <th>Fill Level</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span className="bin-id-badge">#EB-9482</span></td>
                                <td>
                                    <div className="category-cell">
                                        <span className="dot bg-blue"></span>
                                        <span>Recyclable Cans</span>
                                    </div>
                                </td>
                                <td>Route Colombo 07</td>
                                <td>
                                    <div className="fill-level-container">
                                        <div className="fill-level-bar bg-blue" style={{ width: "80%" }}></div>
                                        <span className="fill-level-text">80%</span>
                                    </div>
                                </td>
                                <td><span className="status-badge status-collected">Collected</span></td>
                                <td>2026-06-05</td>
                            </tr>
                            <tr>
                                <td><span className="bin-id-badge">#EB-9120</span></td>
                                <td>
                                    <div className="category-cell">
                                        <span className="dot bg-green"></span>
                                        <span>Organic Waste</span>
                                    </div>
                                </td>
                                <td>Route Kandy Central</td>
                                <td>
                                    <div className="fill-level-container">
                                        <div className="fill-level-bar bg-orange" style={{ width: "45%" }}></div>
                                        <span className="fill-level-text">45%</span>
                                    </div>
                                </td>
                                <td><span className="status-badge status-pending">Pending</span></td>
                                <td>2026-06-07</td>
                            </tr>
                            <tr>
                                <td><span className="bin-id-badge">#EB-8891</span></td>
                                <td>
                                    <div className="category-cell">
                                        <span className="dot bg-orange"></span>
                                        <span>General Dry Waste</span>
                                    </div>
                                </td>
                                <td>Route Galle Coastal</td>
                                <td>
                                    <div className="fill-level-container">
                                        <div className="fill-level-bar bg-green" style={{ width: "15%" }}></div>
                                        <span className="fill-level-text">15%</span>
                                    </div>
                                </td>
                                <td><span className="status-badge status-scheduled">Scheduled</span></td>
                                <td>2026-06-08</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </UserDashboardLayout>
    );
}

export default UserHome;
