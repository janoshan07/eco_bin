import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../Assets/logo.png"; // Make sure this path is correct
import SideBar from './SideBar';
import '../styles/ManageCategories.css';

export default function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [editedItem, setEditedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        axios.get("http://localhost:8070/category/view-categories")
            .then((res) => {
                setCategories(res.data);
            }).catch((err) => {
                console.error("Error fetching categories:", err);
            });
    };

    const handleEdit = (categoryId) => {
        setEditedItem(categoryId);
    };

    const saveEdit = (categoryId, newData) => {
        axios.put(`http://localhost:8070/category/update-category/${categoryId}`, newData)
            .then(() => {
                alert("Category updated");
                setEditedItem(null);
                getCategories();
            }).catch((err) => {
                console.error("Error updating category", err);
            });
    };

    const deleteData = (categoryId) => {
        axios.delete(`http://localhost:8070/category/delete-category/${categoryId}`)
            .then(() => {
                alert("Category deleted!");
                getCategories();
            })
            .catch((err) => {
                alert("Failed to delete category.");
                console.error(err);
            });
    };

    // Filtered categories for search
    const filteredCategories = categories.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // PDF generator with logo
    const handleGeneratePDF = async () => {
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();

        // Convert logo to base64
        const getBase64ImageFromURL = (url) => {
            return new Promise((resolve, reject) => {
                if (!url) {
                    reject(new Error("URL is empty"));
                    return;
                }
                if (url.startsWith('data:')) {
                    resolve(url);
                    return;
                }
                const img = new Image();
                if (url.startsWith('/') || url.startsWith(window.location.origin)) {
                    // Same-origin, no crossOrigin config needed
                } else {
                    img.crossOrigin = "Anonymous";
                }
                img.src = url;
                img.onload = () => {
                    try {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        const dataURL = canvas.toDataURL("image/png");
                        resolve(dataURL);
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = (err) => reject(err);
            });
        };

        try {
            let logoBase64 = null;
            try {
                logoBase64 = await getBase64ImageFromURL(logo);
            } catch (err) {
                console.warn("Failed to load logo for PDF:", err);
            }

            // ===== HEADER =====
            if (logoBase64) {
                doc.addImage(logoBase64, "PNG", pageWidth / 2 - 15, 10, 30, 30);
            }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(34, 139, 34);
            doc.text("Category List Report", pageWidth / 2, logoBase64 ? 50 : 25, { align: "center" });

            doc.setFontSize(12);
            doc.setTextColor(80, 80, 80);
            const generatedDate = new Date().toLocaleString();
            doc.text(`Generated on: ${generatedDate}`, pageWidth / 2, logoBase64 ? 58 : 33, { align: "center" });

            // ===== TABLE =====
            const tableColumns = ["No", "Category Name", "Description"];
            const tableRows = filteredCategories.map((item, index) => [
                index + 1,
                item.name,
                item.description || "N/A"
            ]);

            autoTable(doc, {
                head: [tableColumns],
                body: tableRows,
                startY: logoBase64 ? 70 : 45,
                theme: "grid",
                headStyles: {
                    fillColor: [46, 204, 113],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    halign: "center",
                    valign: "middle",
                },
                bodyStyles: {
                    textColor: [50, 50, 50],
                    fontSize: 10,
                    halign: "center",
                    valign: "middle",
                },
                alternateRowStyles: { fillColor: [240, 255, 240] },
                styles: { lineColor: [180, 180, 180], lineWidth: 0.2, cellPadding: 4 },
                margin: { top: logoBase64 ? 40 : 20 },
                didDrawPage: function (data) {
                    const pageCount = doc.internal.getNumberOfPages();
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text(
                        `Page ${data.pageNumber} of ${pageCount}`,
                        pageWidth - 20,
                        doc.internal.pageSize.height - 10,
                        { align: "right" }
                    );
                },
            });

            // ===== FOOTER =====
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFont("helvetica", "italic");
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(
                "This report was automatically generated by EcoTrack System",
                pageWidth / 2,
                finalY,
                { align: "center" }
            );

            doc.save("Category_Report.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    return (
        <div className="admin-container">
            <SideBar />
            <div className="categories-table">
                <h1 className="head1">Manage Categories</h1>

                <div className="search-export-bar">
                    <input
                        type="text"
                        placeholder="Search by category name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button className="export-btn" onClick={handleGeneratePDF}>Generate PDF</button>
                </div>

                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr className="tblrw">
                            <th>No</th>
                            <th>Category Name</th>
                            <th>Description</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((item, index) => (
                            <tr className="tblrw" key={item._id}>
                                <th>{index + 1}</th>
                                <td>
                                    {editedItem === item._id ? (
                                        <input type="text" defaultValue={item.name} data-id={`${item._id}-name`} />
                                    ) : (
                                        item.name
                                    )}
                                </td>
                                <td>
                                    {editedItem === item._id ? (
                                        <input type="text" defaultValue={item.description} data-id={`${item._id}-description`} />
                                    ) : (
                                        item.description
                                    )}
                                </td>
                                <td>
                                    {editedItem === item._id ? (
                                        <>
                                            <button
                                                className="svebtn"
                                                onClick={() =>
                                                    saveEdit(item._id, {
                                                        name: document.querySelector(`input[data-id="${item._id}-name"]`).value,
                                                        description: document.querySelector(`input[data-id="${item._id}-description"]`).value,
                                                    })
                                                }
                                            >
                                                Save
                                            </button>
                                            <button className="cnlbtn" onClick={() => setEditedItem(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <button type="button" className="editbtn" onClick={() => handleEdit(item._id)}>Edit</button>
                                    )}
                                </td>
                                <td>
                                    <button type="button" className="deletebtn" onClick={() => deleteData(item._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
