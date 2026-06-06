import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RecycleHistory.css';
import Header from './../Header';
import Footer from './../Footer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../../Assets/logo.png'; // ✅ Add logo

const RecycleHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    items: [],
    paymentType: '',
    status: ''
  });

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8070/api/recycle/history/${userEmail}`,
          { headers: { 'x-auth-token': token } }
        );
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, [userEmail]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8070/api/recycle/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setHistory(history.filter((record) => record._id !== id));
      alert('Record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      items: record.items.map((item) => ({
        itemName: item.itemName,
        weight: item.weight,
        total: item.total
      })),
      paymentType: record.paymentType || '',
      status: record.status || 'Pending'
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] =
      field === 'weight' || field === 'total' ? Number(value) : value;
    if (field === 'weight' && updatedItems[index].weight > 0) {
      const pricePerKg =
        updatedItems[index].total / (updatedItems[index].weight || 1);
      updatedItems[index].total = Number((pricePerKg * value).toFixed(2));
    }
    setFormData({ ...formData, items: updatedItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: '', weight: 0, total: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const totalWeight = formData.items.reduce(
        (sum, item) => sum + (item.weight || 0),
        0
      );
      const totalPrice = formData.items.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      const toReceive = Math.max(0, totalPrice - 20);

      const updateData = {
        ...formData,
        totalWeight,
        totalPrice,
        toReceive,
        dateTime: editingRecord.dateTime
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8070/api/recycle/${editingRecord._id}`,
        updateData,
        { headers: { 'x-auth-token': token } }
      );

      setHistory(
        history.map((rec) =>
          rec._id === editingRecord._id ? response.data : rec
        )
      );

      setEditingRecord(null);
      alert('Record updated successfully');
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Failed to update record');
    }
  };

  const filteredHistory = history.filter((record) =>
    record.items.some((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ✅ PDF GENERATOR (Styled Like UserWasteDetails)
  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

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
      const logoBase64 = await getBase64ImageFromURL(logo);

      // ===== HEADER =====
      doc.addImage(logoBase64, "PNG", pageWidth / 2 - 15, 10, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(34, 139, 34);
      doc.text("Recycle History Report", pageWidth / 2, 50, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      const generatedDate = new Date().toLocaleString();
      doc.text(`Generated on: ${generatedDate}`, pageWidth / 2, 58, { align: "center" });

      // ===== TABLE =====
      const tableColumn = [
        "No",
        "Item Name(s)",
        "Total Weight (kg)",
        "Total Price (Rs)",
        "To Receive (Rs)",
        "Payment Type",
        "Status",
        "Date & Time",
      ];

      const tableRows = filteredHistory.map((record, index) => [
        index + 1,
        record.items.map((i) => i.itemName).join(", "),
        record.totalWeight || 0,
        record.totalPrice?.toFixed(2) || "0.00",
        record.toReceive?.toFixed(2) || "0.00",
        record.paymentType || "N/A",
        record.status || "Pending",
        new Date(record.dateTime).toLocaleString(),
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
        },
        bodyStyles: {
          textColor: [50, 50, 50],
          fontSize: 10,
          halign: "center",
        },
        alternateRowStyles: { fillColor: [240, 255, 240] },
        styles: { lineColor: [180, 180, 180], lineWidth: 0.2, cellPadding: 4 },
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

      doc.save("RecycleHistory_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="history-container">
        <h2>Recycle History</h2>

        {/* Search + PDF */}
        <div className="history-actions">
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="history-search-input"
          />
          <button onClick={generatePDF} className="history-pdf-btn">
            Download PDF
          </button>
        </div>

        {filteredHistory.length > 0 ? (
          filteredHistory.map((record) => (
            <div key={record._id} className="history-card">
              <div className="left-section">
                <div className="left-box">
                  {record.items.map((item, index) => (
                    <div className="item-row" key={index}>
                      <span>{item.itemName}</span>
                      <span>{item.weight} kg</span>
                      <span>Rs {item.total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="total-row">
                    <span>Total</span>
                    <span>{record.totalWeight} kg</span>
                    <span>Rs {record.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="service-fee">
                    <span>Service Fee</span>
                    <span>- Rs 20.00</span>
                  </div>
                  <div className="to-receive">
                    <span>To Receive</span>
                    <span>Rs {record.toReceive.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="right-section">
                <p><strong>Payment Method:</strong> {record.paymentType}</p>
                <p><strong>Date & Time:</strong> {new Date(record.dateTime).toLocaleString()}</p>
                <p className="statuss"><strong>Status:</strong> {record.status || 'Pending'}</p>
                <button className="update-btn" onClick={() => handleEdit(record)}>Update</button>
                <button className="delete-btn" onClick={() => handleDelete(record._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No recycle history found.</p>
        )}
      </div>

      {/* Update Modal */}
      {editingRecord && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Record</h3>
              <button className="close-btn" onClick={() => setEditingRecord(null)}>×</button>
            </div>
            <form onSubmit={handleUpdate} className="update-form">
              <div className="form-section">
                <h4>Items</h4>
                {formData.items.map((item, index) => (
                  <div key={index} className="edit-item-row">
                    <div className="form-group">
                      <label>Item Name</label>
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        placeholder="Item Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number"
                        value={item.weight}
                        onChange={(e) => handleItemChange(index, 'weight', e.target.value)}
                        placeholder="Weight"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Total (Rs)</label>
                      <input
                        type="number"
                        value={item.total}
                        onChange={(e) => handleItemChange(index, 'total', e.target.value)}
                        placeholder="Total"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="add-item-btn" onClick={handleAddItem}>
                  + Add Item
                </button>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Digital Wallet">Digital Wallet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingRecord(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default RecycleHistory;
