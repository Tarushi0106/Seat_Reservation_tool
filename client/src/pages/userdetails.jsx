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
        endTime: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to book a seat.');
            return;
        }

        // Validate time
        if (formData.startTime === formData.endTime) {
            alert('Start time and end time cannot be the same.');
            return;
        }

        if (formData.startTime > formData.endTime) {
            alert('End time cannot be earlier than start time.');
            return;
        }

        // Calculate time difference
        const startTime = new Date(`1970-01-01T${formData.startTime}`);
        const endTime = new Date(`1970-01-01T${formData.endTime}`);
        const timeDifference = (endTime - startTime) / (1000 * 60); // Difference in minutes

        if (timeDifference < 15) {
            alert('Seat must be booked for at least 15 minutes.');
            return;
        }

        const formattedData = {
            ...formData,
        };

        console.log('Formatted data being sent to the backend:', formattedData); // Debugging log

        try {
            const response = await axios.post(
                'https://seat-reservation-tool.onrender.com/user/userdetails',
                formattedData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.status === 201) {
                alert('Seat booked successfully!');
                navigate('/thankyoupage');
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error during booking:', error); // Debugging log
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            alert(`Error: ${errorMessage}`);
        }

        setFormData({
            name: '', email: '', contact: '', date: '',
            startTime: '', endTime: '',
        });
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
                    </div>

                    <label>To:</label>
                    <div className="time-input">
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} aria-label="End Time" required />
                    </div>
                </div>

                <button type="submit">Book Seat</button>
                <Link to="/thankyoupage"></Link>
            </form>
        </div>
    );
}