import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';
import { Link } from 'react-router-dom';

export default function RegisterSeat() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [seatnumber, setSeatnumber] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        if (name === 'contact') setContact(value);
        if (name === 'date') setDate(value);
        if (name === 'time') setTime(value);
        if (name === 'seatnumber') setSeatnumber(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userdetails = {
            name,
            contact,
            date,
            time,
            seatnumber,
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/userdetails`, userdetails, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                const data = response.data;
                console.log('Details saved successfully!', data);
                localStorage.setItem('token', data.token);
                navigate('/thankyoupage');
            } else {
                console.error('Error saving details', response.data);
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error registering user:', error.response?.data || error.message);
            alert(`Error: ${error.response?.data.message || error.message}`);
        }

        setName('');
        setContact('');
        setDate('');
        setTime('');
        setSeatnumber('');
    };

    return (
        <div className="container">
            <h1>Book Your Office Seat</h1>
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                />
                <input
                    type="tel"
                    name="contact"
                    value={contact}
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={handleChange}
                    required
                />
                <input
                    type="time"
                    name="time"
                    value={time}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="seatnumber"
                    value={seatnumber}
                    onChange={handleChange}
                    placeholder="Enter seat number"
                    required
                />
                <button type="submit">Book Seat </button>
                <Link to="/thankyoupage"></Link>
            </form>
        </div>
    );
}
