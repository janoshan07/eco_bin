import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SideBar from './SideBar';
import '../styles/ManageCategories.css';

export default function ManageRoutes() {
    const [routes, setRoutes] = useState([]);
    const [editedItem, setEditedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getRoutes();
    }, []);

    const getRoutes = () => {
        axios.get("http://localhost:8070/routedetail/view-route")
            .then((res) => {
                setRoutes(res.data);
            }).catch((err) => {
                console.error("Error fetching routes:", err);
            });
    };

    const handleEdit = (routeId) => {
        setEditedItem(routeId);
    };

    const saveEdit = (routeId, newData) => {
        axios.put(`http://localhost:8070/routedetail/update-route/${routeId}`, newData)
            .then(() => {
                alert("Route updated");
                setEditedItem(null);
                getRoutes();
            }).catch((err) => {
                console.error("Error updating route", err);
            });
    };

    const deleteData = (routeId) => {
        axios.delete(`http://localhost:8070/routedetail/delete-route/${routeId}`)
            .then(() => {
                alert("Route deleted!");
                getRoutes();
            })
            .catch((err) => {
                alert(err);
            });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const generatePDF = () => {
        try {
            const doc = new jsPDF();
            doc.text("Route Details Report", 14, 15);
            const tableColumn = ["No", "Date", "Route", "Time"];
            const tableRows = [];

            routes
                .filter(item => item.route?.toLowerCase().includes(searchTerm))
                .forEach((item, index) => {
                    const rowData = [
                        index + 1,
                        item.date || "N/A",
                        item.route || "N/A",
                        item.time || "N/A",
                    ];
                    tableRows.push(rowData);
                });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 20,
            });

            doc.save("route_details_report.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    return (
        <div className="admin-container">
            <SideBar />
            <div className="categories-table">
                <h1 className="head1">Manage Route Details</h1>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Search by route"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="pdfbtn" onClick={generatePDF}>Generate PDF</button>
                </div>

                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr className="tblrw">
                            <th scope="col">No</th>
                            <th scope="col">Date</th>
                            <th scope="col">Route</th>
                            <th scope="col">Time</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="categories-table">
                        {routes
                            .filter(item => item.route?.toLowerCase().includes(searchTerm))
                            .map((item, index) => (
                                <tr className="tblrw" key={item._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        {editedItem === item._id ? (
                                            <input
                                                type="date"
                                                defaultValue={item.date ? new Date(item.date).toISOString().split('T')[0] : ''}
                                                data-id={`${item._id}-date`}
                                            />
                                        ) : (
                                            item.date
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <input
                                                type="text"
                                                defaultValue={item.route}
                                                data-id={`${item._id}-route`}
                                            />
                                        ) : (
                                            item.route
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <input
                                                type="time"
                                                defaultValue={item.time}
                                                data-id={`${item._id}-time`}
                                            />
                                        ) : (
                                            item.time
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <>
                                                <button className="svebtn" onClick={() => saveEdit(item._id, {
                                                    date: document.querySelector(`input[data-id="${item._id}-date"]`).value,
                                                    route: document.querySelector(`input[data-id="${item._id}-route"]`).value,
                                                    time: document.querySelector(`input[data-id="${item._id}-time"]`).value,
                                                })}>Save</button>
                                                <button className="cnlbtn" onClick={() => setEditedItem(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <button className="editbtn" onClick={() => handleEdit(item._id)}>Edit</button>
                                        )}
                                    </td>
                                    <td>
                                        <button className="deletebtn" onClick={() => deleteData(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
