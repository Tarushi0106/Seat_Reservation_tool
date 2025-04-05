import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';
import { Link } from 'react-router-dom';

export default function RegisterSeat() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        date: '',
        startTime: '',
        startPeriod: 'AM',
        endTime: '',
        endPeriod: 'AM',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Helper function to convert 12-hour time to minutes since midnight
    const timeToMinutes = (time, period) => {
        const [hours, minutes] = time.split(':').map(Number);
        let adjustedHours = hours % 12; // Convert 12 AM/PM to 0
        if (period === 'PM') adjustedHours += 12;
        return adjustedHours * 60 + minutes;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to book a seat.');
            return;
        }

        try {
            const startMinutes = timeToMinutes(formData.startTime, formData.startPeriod);
            const endMinutes = timeToMinutes(formData.endTime, formData.endPeriod);
            const timeDifference = endMinutes - startMinutes;

            console.log('Start Minutes:', startMinutes);
            console.log('End Minutes:', endMinutes);
            console.log('Time Difference (minutes):', timeDifference);

            if (timeDifference <= 0) {
                alert('End time must be after start time.');
                return;
            }

            if (timeDifference < 15) {
                alert('Seat must be booked for at least 15 minutes.');
                return;
            }

            const formattedData = {
                ...formData,
                startTime: `${formData.startTime} ${formData.startPeriod}`,
                endTime: `${formData.endTime} ${formData.endPeriod}`
            };

            console.log('Formatted data being sent to the backend:', formattedData);

            const response = await axios.post(
                'http://localhost:3000/user/userdetails',
                formattedData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.status === 201) {
                alert('Seat booked successfully!');
                navigate('/thankyoupage');
                setFormData({
                    name: '', email: '', contact: '', date: '',
                    startTime: '', startPeriod: 'AM',
                    endTime: '', endPeriod: 'AM',
                });
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error during booking:', error);
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';

            if (errorMessage.includes('already booked')) {
                alert(`Error: ${errorMessage}`);
            } else if (errorMessage.includes('You cannot book a seat twice')) {
                alert('You have already booked a seat. You cannot book another one.');
            } else {
                alert(`Error: ${errorMessage}`);
            }
        }
    };

    return (
        <div className="container">
            <h1>Book Your Office Seat</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" aria-label="Name" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" aria-label="Email" required />
                <input type="tel" name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter your contact number" aria-label="Contact" required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} aria-label="Date" required />

                <div className="time-container">
                    <label>From:</label>
                    <div className="time-input">
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} aria-label="Start Time" required />
                        <select className="am" name="startPeriod" value={formData.startPeriod} onChange={handleChange} aria-label="Start Period" required>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>

                    <label>To:</label>
                    <div className="time-input">
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} aria-label="End Time" required />
                        <select className="am" name="endPeriod" value={formData.endPeriod} onChange={handleChange} aria-label="End Period" required>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>

                <button type="submit">Book Seat</button>
                <Link to="/thankyoupage"></Link>
            </form>
        </div>
    );
}
