import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";
import "./styles/Footer.css";

export default function Footer() {
    return (
        <div className="modern-footer-wrapper">
            <footer className="modern-footer">
                {/* Column 1: Brand & Description */}
                <div className="footer-col footer-brand-col">
                    <div className="footer-brand">
                        <img src={logo} alt="EcoBin Logo" className="footer-logo-img" />
                        <span className="footer-brand-name">EcoBin</span>
                    </div>
                    <p className="footer-about-text">
                        EcoBin is a smart urban waste management platform dedicated to cleaner 
                        cities and sustainable practices. We streamline waste collection, recycling, 
                        and organic disposal, turning daily waste into valuable resources.
                    </p>
                    <div className="footer-social-links">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
                            <i className='bx bxl-facebook-circle'></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Twitter">
                            <i className='bx bxl-twitter'></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
                            <i className='bx bxl-instagram'></i>
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer-col footer-links-col">
                    <h4 className="footer-section-title">Quick Links</h4>
                    <ul className="footer-nav-links">
                        <li>
                            <Link to="/UserHome">
                                <i className='bx bx-chevron-right link-arrow'></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/recyclehome">
                                <i className='bx bx-chevron-right link-arrow'></i>
                                <span>Recycle Hub</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/addschedule">
                                <i className='bx bx-chevron-right link-arrow'></i>
                                <span>Schedule Pickup</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Compost-Actions">
                                <i className='bx bx-chevron-right link-arrow'></i>
                                <span>Compost Store</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Garbage-Actions">
                                <i className='bx bx-chevron-right link-arrow'></i>
                                <span>Waste Collection</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Contact Info */}
                <div className="footer-col footer-contact-col">
                    <h4 className="footer-section-title">Contact Us</h4>
                    <div className="footer-contact-info">
                        <div className="contact-item">
                            <div className="contact-icon-badge badge-green">
                                <i className='bx bx-map-pin'></i>
                            </div>
                            <div className="contact-item-text">
                                <span className="contact-label">Location</span>
                                <span className="contact-text">Malabe, Sri Lanka</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon-badge badge-blue">
                                <i className='bx bx-phone'></i>
                            </div>
                            <div className="contact-item-text">
                                <span className="contact-label">Call Us</span>
                                <span className="contact-text">+94 11 234 5678</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon-badge badge-purple">
                                <i className='bx bx-envelope'></i>
                            </div>
                            <div className="contact-item-text">
                                <span className="contact-label">Email Support</span>
                                <span className="contact-text">support@ecobin.lk</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="modern-footer-bottom">
                <div className="footer-bottom-inner">
                    <p className="copyright-text">
                        &copy; {new Date().getFullYear()} EcoBin. All rights reserved. Helping build a greener future.
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#privacy" className="bottom-link">Privacy Policy</a>
                        <span className="link-separator">•</span>
                        <a href="#terms" className="bottom-link">Terms of Service</a>
                        <span className="link-separator">•</span>
                        <a href="#support" className="bottom-link">Support Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
