import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SeatCancellation.css';

const SeatCancellation = () => {
  const [seatnumber, setSeatnumber] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') setName(value);
    if (name === 'contact') setContact(value);
    if (name === 'seatnumber') setSeatnumber(value);
  };

  const handleCancellation = async (e) => {
    e.preventDefault();

    const seatCancellation = { contact, seatnumber, name };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/cancelseat`,
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
    setSeatnumber('');
  };

  return (
    <div className="seat-cancellation-container">
      <h1>Cancel Your Booking</h1>
      <p>Enter your details below to cancel your booking.</p>

      <input
        type="text"
        name="seatnumber"
        value={seatnumber}
        onChange={handleInputChange}
        placeholder="Enter seat number"
      />

      <input
        type="text"
        name="name"
        value={name}
        onChange={handleInputChange}
        placeholder="Enter your name"
      />

      <input
        type="text"
        name="contact"
        value={contact}
        onChange={handleInputChange}
        placeholder="Enter contact number"
      />

      <button onClick={handleCancellation}>Confirm Cancellation</button>
    </div>
  );
};

export default SeatCancellation;
