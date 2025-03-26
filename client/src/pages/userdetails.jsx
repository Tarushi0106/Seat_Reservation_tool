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
        time: '',
        seatnumber: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token); // Debugging log

        if (!token) {
            console.error('No token found in localStorage');
            alert('You must be logged in to book a seat.');
            return;
        }

        try {
            const response = await axios.post(
                'https://seat-reservation-tool.onrender.com//user/userdetails',
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.status === 201) {
                console.log('Details saved successfully!', response.data);
                localStorage.setItem('token', response.data.token);
                navigate('/thankyoupage');
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error registering user:', error.response?.data || error.message);
            alert(`Error: ${error.response?.data.message || error.message}`);
        }

        setFormData({ name: '', email: '', contact: '', date: '', time: '', seatnumber: '' });
    };

    return (
        <div className="container">
            <h1>Book Your Office Seat</h1>
            <form className="form" onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <input
                        key={key}
                        type={key === 'email' ? 'email' : key === 'contact' ? 'tel' : 'text'}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        placeholder={`Enter your ${key}`}
                        required
                    />
                ))}
                <button type="submit">Book Seat</button>
                <Link to="/thankyoupage"></Link>
            </form>
        </div>
    );
}