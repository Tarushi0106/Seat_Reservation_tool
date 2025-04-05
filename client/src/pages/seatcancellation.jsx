import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './seatcancel.css';

const SeatCancellation = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') setName(value);
    if (name === 'contact') setContact(value);
    if (name === 'email') setEmail(value); // Handle email input change
  };

  const handleCancellation = async (e) => {
    e.preventDefault();

    const seatCancellation = { contact, name, email }; // Removed seatnumber

    try {
      const response = await axios.post(
        'https://seat-reservation-tool.onrender.com/user/cancelseat', // Ensure this matches the backend route
        seatCancellation,
        { headers: { 'Content-Type': 'application/json' } }
    );

      alert('Seat cancelled successfully!');
      localStorage.removeItem('token');
      navigate('/home');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred.';
      alert(`Error: ${errorMessage}`);
    }

    setName('');
    setContact('');
    setEmail(''); // Reset email state
  };

  return (
    <div className="seat-cancellation-container">
      <h1>Cancel Your Booking</h1>
      <p>Enter your details below to cancel your booking.</p>

      <form onSubmit={handleCancellation}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          required
        />

        <input
          type="text"
          name="contact"
          value={contact}
          onChange={handleInputChange}
          placeholder="Enter contact number"
          required
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />

        <button type="submit">Confirm Cancellation</button>
      </form>
    </div>
  );
};

export default SeatCancellation;