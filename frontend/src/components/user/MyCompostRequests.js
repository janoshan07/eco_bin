import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import "./../styles/MyCompostRequests.css";
import Footer from "../Footer";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../Assets/logo.png"; // ✅ Import your local logo

export default function MyCompostRequests() {
  const [compostRequests, setCompostRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [newAmount, setNewAmount] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [cost, setCost] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/compostRequest/getcompostrequest/${userEmail}`
        );
        if (Array.isArray(response.data)) {
          setCompostRequests(response.data);
        } else {
          setCompostRequests([]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, [userEmail]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8070/compostRequest/deletecompostrequest/${id}`
      );
      setCompostRequests(
        compostRequests.filter((request) => request._id !== id)
      );
    } catch (err) {
      console.error("Error deleting request", err);
    }
  };

  const handleUpdate = async (id, potential) => {
    if (newAmount > potential) {
      alert(`Amount cannot exceed the potential (${potential})`);
      return;
    }

    try {
      await axios.put(
        `http://localhost:8070/compostRequest/updatemycompostrequest/${id}`,
        {
          email: userEmail,
          amount: newAmount,
          address: newAddress,
          cost: newAmount * 250,
        }
      );
      setCompostRequests(
        compostRequests.map((request) =>
          request._id === id
            ? { ...request, amount: newAmount, address: newAddress, cost: newAmount * 250 }
            : request
        )
      );
      setEditingRequest(null);
    } catch (err) {
      console.error("Error updating request", err);
    }
  };

  useEffect(() => {
    if (newAmount) setCost(newAmount * 250);
    else setCost(0);
  }, [newAmount]);

  // ✅ Filter compost requests
  const filteredRequests = compostRequests.filter((request) =>
    request.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========================= 🧾 Enhanced PDF Generator (with Logo, Header, Footer) =========================
  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Convert imported image to Base64
    const getBase64ImageFromURL = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (err) => reject(err);
      });
    };

    try {
      // ✅ Convert logo to Base64
      const logoBase64 = await getBase64ImageFromURL(logo);

      // ===== HEADER =====
      doc.addImage(logoBase64, "PNG", pageWidth / 2 - 15, 10, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(34, 139, 34);
      doc.text("My Compost Requests Report", pageWidth / 2, 50, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      const generatedDate = new Date().toLocaleString();
      doc.text(`Generated on: ${generatedDate}`, pageWidth / 2, 58, { align: "center" });

      // ===== TABLE =====
      const tableColumn = ["No", "Potential Weight", "Desired Amount", "Cost (LKR)", "Address", "Status"];
      const tableRows = filteredRequests.map((req, index) => [
        index + 1,
        req.potential || "N/A",
        req.amount || "N/A",
        req.cost || "N/A",
        req.address || "N/A",
        req.status || "N/A",
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: "grid",
        headStyles: {
          fillColor: [46, 204, 113],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
          fontSize: 12,
        },
        bodyStyles: {
          textColor: [50, 50, 50],
          fontSize: 10,
          halign: "center",
          valign: "middle",
        },
        alternateRowStyles: {
          fillColor: [240, 255, 240],
        },
        styles: {
          lineColor: [180, 180, 180],
          lineWidth: 0.2,
          cellPadding: 4,
        },
        margin: { top: 40 },
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

      // Save file
      doc.save("MyCompostRequests_Report.pdf");
    } catch (error) {
      console.error("Error loading logo image:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // ========================= UI =========================
  return (
    <>
      <div className="compost-requests-page">
        <Header />
        <h1 className="page-title">My Compost Requests</h1>

        {/* Search & PDF Controls */}
        <div className="compost-actions">
          <input
            type="text"
            placeholder="Search by address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="compost-input-search"
          />
          <button onClick={generatePDF} className="compost-pdf-btn">
            Download PDF
          </button>
        </div>

        <table className="compost-requests-table">
          <thead>
            <tr>
              <th>Potential Weight</th>
              <th>Desired Compost Amount</th>
              <th>Cost</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
              filteredRequests.map((compostRequest) => (
                <tr key={compostRequest._id}>
                  <td>{compostRequest.potential}</td>
                  <td>
                    {editingRequest === compostRequest._id ? (
                      <input
                        type="number"
                        className="edit-input"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                      />
                    ) : (
                      compostRequest.amount
                    )}
                  </td>
                  <td>{editingRequest === compostRequest._id ? cost : compostRequest.cost}</td>
                  <td>
                    {editingRequest === compostRequest._id ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                      />
                    ) : (
                      compostRequest.address
                    )}
                  </td>
                  <td>{compostRequest.status}</td>
                  <td className="action-buttons">
                    {editingRequest === compostRequest._id ? (
                      <>
                        <button
                          className="save-button"
                          onClick={() =>
                            handleUpdate(compostRequest._id, compostRequest.potential)
                          }
                        >
                          Save
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => setEditingRequest(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => {
                            setEditingRequest(compostRequest._id);
                            setNewAmount(compostRequest.amount);
                            setNewAddress(compostRequest.address);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(compostRequest._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-requests-message">
                  No compost requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}
