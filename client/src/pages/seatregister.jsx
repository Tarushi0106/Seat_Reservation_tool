import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import seatPlan from './seatplan.png';

import './SeatRegister.css';

const SeatRegister = () => {
  const navigate = useNavigate();
  const [seatnumber, setSeatnumber] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'seatnumber') setSeatnumber(value);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const seatData = {
      seatnumber,
      name,
      contact,
    };

    try {
      const response = await axios.post(${import.meta.env.VITE_BASE_URL}/user/register_seat, seatData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        const data = response.data;
        console.log('Seat registered successfully:', data);
        localStorage.setItem('token', data.token);
        navigate('/userdetails');
      } else {
        console.error('Error registering seat:', response.data);
        alert(Error: ${response.data.message});
      }
    } catch (error) {
      console.error('Error registering seat:', error.response?.data || error.message);
      alert(Error: ${error.response?.data.message || error.message});
    }
  };

  return (
    <div className="seat-register-container">
      <h1 className="title">Select your seat prior to avoid the hassle!</h1>
      <div className="seat-plan-container">
        <img src={seatPlan} alt="Office Seat Plan" className="seat-plan-image" />
      </div>

      {/* Booking Container */}
      <div className="booking-container">
        <label>Enter the selected seat number:</label>
        <input
          type="text"
          name="seatnumber"
          value={seatnumber}
          onChange={handleInputChange}
          placeholder="e.g., 1, 2 , 3, ...."
        />
        <button onClick={handleBooking}>Book Seat</button>
      </div>
    </div>
  );
};