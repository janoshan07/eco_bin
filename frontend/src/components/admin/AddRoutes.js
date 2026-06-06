import React, { useState } from "react";
import axios from "axios";
import SideBar from './SideBar';
import "../styles/AddCategory.css";

export default function AddRoutes() {

    const [date, setDate] = useState("");
    const [route, setRoute] = useState("");
    const [time, setTime] = useState("");

    // Get today's date in YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // Get current time in HH:MM (24hr format)
    const getCurrentTime = () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    };

    // Determine if selected date is today
    const isToday = date === getTodayDate();

    // Submit handler
    function sendData(e) {
        e.preventDefault();

        const newRoute = {
            date: date.trim(),
            route: route.trim(),
            time: time.trim()
        };

        axios.post("http://localhost:8070/routedetail/add-route", newRoute)
            .then(() => {
                alert("Route Added Successfully!");
                setDate("");
                setRoute("");
                setTime("");
            })
            .catch(err => {
                console.error(err);
                alert("Failed to add route. Please try again.");
            });
    }

    return (
        <div className="admin-container">
            <SideBar />
            <form className="add-category-form" onSubmit={sendData}>
                <h2>Add Route</h2>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-control1"
                        id="date"
                        placeholder="Select Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={getTodayDate()}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="route" className="form-label">Route</label>
                    <textarea
                        className="form-control1"
                        id="route"
                        placeholder="Enter route"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="time" className="form-label">Time</label>
                    <input
                        type="time"
                        className="form-control1"
                        id="time"
                        placeholder="Select time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        min={isToday ? getCurrentTime() : "00:00"}
                        required
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button type="submit" className="btn11">Add Route</button>
                </div>
            </form>
        </div>
    );
}
