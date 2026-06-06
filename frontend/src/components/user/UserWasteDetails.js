import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import "../styles/UserWasteDetails.css";
import Footer from "../Footer";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../Assets/logo.png"; // ✅ Import local logo at the top of your file

export default function UserWasteDetails() {
  const [wastedetails, setWastesDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    category: "",
    waste: "",
    weight: "",
    weightType: "",
    quantity: "",
    route: "",
  });

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (userEmail) {
      getWasteDetails(userEmail);
      getCategories();
      getRoutes();
    }
  }, [userEmail]);

  const getWasteDetails = (email) => {
    axios
      .get(`http://localhost:8070/wastedetail/user-waste/${email}`)
      .then((res) => setWastesDetails(res.data))
      .catch((err) => console.error("Error fetching waste details:", err));
  };

  const getCategories = () => {
    axios
      .get("http://localhost:8070/category/view-categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  const getRoutes = () => {
    axios
      .get("http://localhost:8070/routedetail/view-route")
      .then((res) => setRoutes(res.data))
      .catch((err) => console.error("Error fetching routes:", err));
  };

  const handleEdit = (item) => {
    setEditedItem(item._id);
    setFormData({
      email: item.email || "",
      category: item.category?._id || "",
      waste: item.waste || "",
      weight: item.weight || "",
      weightType: item.weightType || "",
      quantity: item.quantity || "",
      route: item.route || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const saveEdit = (wasteId) => {
    if (!formData.category) {
      alert("Please select a valid category.");
      return;
    }

    axios
      .put(`http://localhost:8070/wastedetail/update-waste/${wasteId}`, formData)
      .then(() => {
        alert("Waste detail updated");
        setEditedItem(null);
        setFormData({
          email: "",
          category: "",
          waste: "",
          weight: "",
          weightType: "",
          quantity: "",
          route: "",
        });
        getWasteDetails(userEmail);
      })
      .catch((err) => {
        console.error("Error updating waste detail", err);
        alert("Failed to update waste detail.");
      });
  };

  const deleteData = (wasteId) => {
    axios
      .delete(`http://localhost:8070/wastedetail/delete-waste/${wasteId}`)
      .then(() => {
        alert("Waste detail deleted!");
        getWasteDetails(userEmail);
      })
      .catch((err) => {
        alert("Failed to delete waste detail.");
        console.error(err);
      });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "N/A";
  };

  // Filter data for search bar
  const filteredWasteDetails = wastedetails.filter((item) =>
    item.waste?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========================= PDF GENERATOR (With Logo FIXED) =========================



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
    // ✅ Convert imported logo to Base64
    const logoBase64 = await getBase64ImageFromURL(logo);

    // ===== HEADER =====
    doc.addImage(logoBase64, "PNG", pageWidth / 2 - 15, 10, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 139, 34);
    doc.text("User Waste Details Report", pageWidth / 2, 50, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    const generatedDate = new Date().toLocaleString();
    doc.text(`Generated on: ${generatedDate}`, pageWidth / 2, 58, { align: "center" });

    // ===== TABLE =====
    const tableColumn = ["No", "Email", "Category", "Waste", "Weight", "Route", "Status"];
    const tableRows = filteredWasteDetails.map((item, index) => [
      index + 1,
      item.email || "N/A",
      getCategoryName(item.category) || "N/A",
      item.waste || "N/A",
      item.weight || "N/A",
      item.route || "N/A",
      item.status || "N/A",
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
    doc.save("UserWasteDetails_Report.pdf");
  } catch (error) {
    console.error("Error loading logo image:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};


  return (
    <>
      <div className="uwd-admin-container">
        <Header />

        {/* Search + PDF */}
        <div className="uwd-actions">
  <h2 className="uwd-title">User Waste Details</h2>
  <div className="uwd-search-bar">
    <input
      type="text"
      placeholder="🔍 Search by waste name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="uwd-input-search"
    />
    <button onClick={generatePDF} className="uwd-pdf-btn">
      📄 Download PDF
    </button>
  </div>
</div>


        <div className="uwd-table-wrapper">
          <table className="uwd-table uwd-table-hover">
            <thead className="uwd-table-dark">
              <tr className="uwd-table-row">
                <th>No</th>
                <th>Email</th>
                <th>Category</th>
                <th>Waste</th>
                <th>Weight</th>
                <th>Route</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="uwd-table-body">
              {filteredWasteDetails.map((item, index) => (
                <tr key={item._id}>
                  <th>{index + 1}</th>
                  <td>
                    {editedItem === item._id ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      item.email || "N/A"
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
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      getCategoryName(item.category) || "N/A"
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
                      item.waste || "N/A"
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
                      item.weight || "N/A"
                    )}
                  </td>
                  <td>
                    {editedItem === item._id ? (
                      <select
                        name="route"
                        value={formData.route}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Route</option>
                        {routes.map((route) => (
                          <option key={route._id} value={route.route}>
                            {`Route: ${route.route}, Date: ${new Date(
                              route.date
                            ).toLocaleDateString()}, Time: ${route.time}`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.route || "N/A"
                    )}
                  </td>
                  <td>{item.status || "N/A"}</td>
                  <td>
                    {editedItem === item._id ? (
                      <>
                        <button onClick={() => saveEdit(item._id)}>Save</button>
                        <button onClick={() => setEditedItem(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)}>Edit</button>
                        <button onClick={() => deleteData(item._id)}>
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
      <Footer />
    </>
  );
}
