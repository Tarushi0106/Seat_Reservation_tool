import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import seatPlan from './seatplan.png';
import './SeatRegister.css';

const SeatRegister = () => {
  const navigate = useNavigate();
  const [seatnumber, setSeatnumber] = useState('');

  const handleInputChange = (e) => {
    setSeatnumber(e.target.value);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!seatnumber.trim()) {
      console.error('Error: Seat number is required');
      alert('Please enter a valid seat number.');
      return;
    }

    const seatData = { seatnumber };

    try {
      const response = await axios.post(
        'https://seat-reservation-tool.onrender.com//user/register_seat',
        seatData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        const data = response.data;
        console.log('Seat registered successfully:', data);
        localStorage.setItem('token', data.token);
        navigate('/userdetails');
      } else {
        console.error('Unexpected response status:', response.status, response.data);
        alert(`Error: ${response.data.message || 'Unexpected error occurred'}`);
      }
    } catch (error) {
      if (error.response) {
        console.error('Server error response:', error.response.data);
        alert(`Server Error: ${error.response.data.message || 'Something went wrong'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Network error: Please check your internet connection.');
      } else {
        console.error('Error setting up request:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="seat-register-container">
      <h1 className="title">Select your seat prior to avoid the hassle!</h1>

      <div className="seat-plan-container">
        <img src={seatPlan} alt="Office Seat Plan" className="seat-plan-image" />
      </div>

      <div className="booking-container">
        <label>Enter the selected seat number:</label>
        <input
          type="text"
          name="seatnumber"
          value={seatnumber}
          onChange={handleInputChange}
          placeholder="e.g., 1, 2, 3, ...."
        />
        <button onClick={handleBooking}>Book Seat</button> 
      </div>

      <div className="cancel-container">
        <button className="cancel-btn" onClick={() => navigate('/seatcancellation')}>
          Want to cancel your booked seat?
        </button>
      </div>
    </div>
  );
};

export default SeatRegister;
