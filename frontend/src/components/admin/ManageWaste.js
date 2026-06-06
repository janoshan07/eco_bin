import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SideBar from './SideBar';
import '../styles/ManageCategories.css';

export default function ManageWaste() {
    const [wastedetails, setWastesDetails] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editedItem, setEditedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        category: '',
        waste: '',
        weight: '',
        weightType: '',
        quantity: '',
        status: ''
    });

    useEffect(() => {
        getWasteDetails();
        getCategories();
    }, []);

    const getWasteDetails = () => {
        axios.get("http://localhost:8070/wastedetail/view-waste")
            .then((res) => {
                setWastesDetails(res.data);
            }).catch((err) => {
                console.error("Error fetching waste details:", err);
            });
    };

    const getCategories = () => {
        axios.get("http://localhost:8070/category/view-categories")
            .then((res) => {
                setCategories(res.data);
            }).catch((err) => {
                console.error("Error fetching categories:", err);
            });
    };

    const handleEdit = (item) => {
        setEditedItem(item._id);
        setFormData({
            email: item.email || '',
            category: item.category?._id || '',
            waste: item.waste || '',
            weight: item.weight || '',
            weightType: item.weightType || '',
            quantity: item.quantity || '',
            status: item.status || ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const saveEdit = (wasteId) => {
        if (!formData.category) {
            alert("Please select a valid category.");
            return;
        }

        axios.put(`http://localhost:8070/wastedetail/update-waste/${wasteId}`, formData)
            .then(() => {
                alert("Waste detail updated");
                setEditedItem(null);
                setFormData({
                    email: '',
                    category: '',
                    waste: '',
                    weight: '',
                    weightType: '',
                    quantity: '',
                    status: ''
                });
                getWasteDetails();
            }).catch((err) => {
                console.error("Error updating waste detail", err);
                alert("Failed to update waste detail. Please check the console for more details.");
            });
    };

    const deleteData = (wasteId) => {
        axios.delete(`http://localhost:8070/wastedetail/delete-waste/${wasteId}`)
            .then(() => {
                alert("Waste detail deleted!");
                getWasteDetails();
            })
            .catch((err) => {
                alert("Failed to delete waste detail.");
                console.error(err);
            });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Waste Details Report", 14, 15);
        const tableColumn = ["No", "Email", "Category", "Waste", "Weight", "Route", "Status"];
        const tableRows = [];

        wastedetails
            .filter(item =>
                item.category?.name?.toLowerCase().includes(searchTerm)
            )
            .forEach((item, index) => {
                const rowData = [
                    index + 1,
                    item.email || 'N/A',
                    item.category?.name || 'N/A',
                    item.waste || 'N/A',
                    item.weight || 'N/A',
                    item.route || 'N/A',
                    item.status || 'N/A'
                ];
                tableRows.push(rowData);
            });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("waste_details_report.pdf");
    };

    return (
        <div className="admin-container">
            <SideBar />
            <div className="categories-table">
                <h1 className="head1">Manage Waste Details</h1>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Search by category name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="pdfbtn" onClick={generatePDF}>Generate PDF</button>
                </div>

                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr className="tblrw">
                            <th scope="col">No</th>
                            <th scope="col">Email</th>
                            <th scope="col">Category</th>
                            <th scope="col">Waste</th>
                            <th scope="col">Weight</th>
                            <th scope="col">Route</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="categories-table">
                        {wastedetails
                            .filter(item => item.category?.name?.toLowerCase().includes(searchTerm))
                            .map((item, index) => (
                                <tr className="tblrw" key={item._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        {editedItem === item._id ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                disabled={true}
                                            />
                                        ) : (
                                            item.email || 'N/A'
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(category => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            item.category?.name || 'N/A'
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <input
                                                type="text"
                                                name="waste"
                                                value={formData.waste}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            item.waste || 'N/A'
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            item.weight || 'N/A'
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <input
                                                type="text"
                                                name="route"
                                                value={formData.route}
                                                disabled={true}
                                            />
                                        ) : (
                                            item.route || 'N/A'
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="On the Way">On the Way</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        ) : (
                                            item.status || 'N/A'
                                        )}
                                    </td>
                                    <td>
                                        {editedItem === item._id ? (
                                            <>
                                                <button className="svebtn" onClick={() => saveEdit(item._id)}>
                                                    Save
                                                </button>
                                                <button className="cnlbtn" onClick={() => setEditedItem(null)}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="editbtn" onClick={() => handleEdit(item)}>
                                                    Edit
                                                </button>
                                                <button className="deletebtn" onClick={() => deleteData(item._id)}>
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
