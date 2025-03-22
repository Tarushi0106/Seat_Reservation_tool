import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SeatCancellation.css';

const SeatCancellation = () => {
  const [seatnumber, setSeatnumber] = useState('');
  const [name , setName]= useState('');
  const [contact , Contact]= useState('');
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
