import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import SideBar from './SideBar';
import Footer from '../Footer';
import './../styles/AllCompostRequests.css';

export default function AllCompostRequests() {
    const [compostRequests, setCompostRequests] = useState([]);
    const [editingRequest, setEditingRequest] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCompostRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8070/compostRequest/getallcompostrequests');
                setCompostRequests(response.data);
            } catch (error) {
                console.error('Error fetching compost requests:', error);
            }
        };
        fetchCompostRequests();
    }, []);

    const handleUpdateStatus = async (id) => {
        try {
            await axios.put(`http://localhost:8070/compostRequest/updatecompostrequest/${id}`, { status: newStatus });
            setCompostRequests(prev =>
                prev.map((r) => r._id === id ? { ...r, status: newStatus } : r)
            );
            setEditingRequest(null);
        } catch (error) {
            console.error('Error updating compost request status:', error);
        }
    };

    const handleDeleteRequest = async (id) => {
        try {
            await axios.delete(`http://localhost:8070/compostRequest/deletecompostrequest/${id}`);
            setCompostRequests(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            console.error('Error deleting compost request:', error);
        }
    };

    const filteredRequests = compostRequests.filter((r) =>
        r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generatePDF = () => {
        try {
            const doc = new jsPDF();
            doc.text('Compost Requests Report', 14, 10);
            const tableData = filteredRequests.map((item, index) => [
                index + 1,
                item.email,
                item.potential,
                item.amount,
                item.cost,
                item.status
            ]);

            autoTable(doc, {
                head: [['#', 'Email', 'Potential (kg)', 'Amount (kg)', 'Cost (Rs)', 'Status']],
                body: tableData
            });

            doc.save('compost_requests.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="ard-page-container">
            <SideBar />
            <div className="ard-content-container">
                <div className="ard-compost-container">
                    <h1 className="ard-compost-title">All Compost Requests</h1>

                    <div className="ard-actions-top">
                        <input
                            type="text"
                            placeholder="Search by email..."
                            className="ard-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="ard-btn" onClick={generatePDF}>Generate PDF</button>
                    </div>

                    <div className="ard-compost-list">
                        {filteredRequests.map((item) => (
                            <div key={item._id} className="ard-compost-item">
                                <p className="ard-compost-text">Email: {item.email}</p>
                                <p className='ard-compost-text'>Potential compost weight: {item.potential}</p>
                                <p className="ard-compost-text">Desired compost Amount: {item.amount} kg</p>
                                <p className="ard-compost-text">Cost: Rs. {item.cost}</p>
                                <p className="ard-compost-text">Status: <span style={{ color: "blue" }}>{item.status}</span></p>
                                <div className="ard-compost-actions">
                                    {editingRequest === item._id ? (
                                        <>
                                            <select
                                                className="ard-compost-select"
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <button className="ard-btn" onClick={() => handleUpdateStatus(item._id)}>Save</button>
                                            <button className="ard-btn ard-cancel-btn" onClick={() => setEditingRequest(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="ard-btn ard-edit-btn" onClick={() => {
                                                setEditingRequest(item._id);
                                                setNewStatus(item.status);
                                            }}>Edit Status</button>
                                            <button className="ard-btn ard-delete-btn" onClick={() => handleDeleteRequest(item._id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
