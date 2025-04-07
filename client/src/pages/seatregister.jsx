import React, { useState, useEffect } from 'react';
import './seatregister.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import the v4 method and rename it as uuidv4

const App = () => {
  const [bookedSeats, setBookedSeats] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const seats = Array.from({ length: 30 }, (_, i) => i + 1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('https://seat-reservation-tool.onrender.com/user/seats')
      .then(res => {
        const bookings = res.data.reduce((acc, cur) => {
          acc[cur.seat] = cur;
          return acc;
        }, {});
        setBookedSeats(bookings);
      })
      .catch(console.error);
  }, [location.pathname]);

  const handleSeatClick = async (seatNumber) => {
    console.log("Seat clicked:", seatNumber);
  
    if (bookedSeats[seatNumber]) {
      const existingUser = bookedSeats[seatNumber];
      alert(`Seat already booked by:\n\nName: ${existingUser.name}\nContact: ${existingUser.contact}`);
      return;
    }
  
    const name = prompt("Enter your name:");
    const contact = prompt("Enter your contact number:");
  
    // Validate name
    if (!name || name.length < 3) {
      alert("Name should be at least 3 characters long.");
      return;
    }
  
    // Validate contact
    const contactRegex = /^\d{10}$/; // Regex to ensure contact is exactly 10 digits
    if (!contact || !contactRegex.test(contact)) {
      alert("Contact should be exactly 10 digits and contain only numbers.");
      return;
    }
  
    // Generate a unique token for the booking
    const token = uuidv4(); // Use the uuidv4 function to generate a UUID
  
    const bookingData = {
      seat: seatNumber,
      name,
      contact,
      token, // Add the token to the booking data
    };
  
    console.log("📤 Sending booking request:", bookingData); // Log the payload
    try {
      const response = await axios.post(
        'https://seat-reservation-tool.onrender.com/user/seats/book',
        bookingData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log("📥 Booking response:", response.data); // Log the response
  
      console.log("✅ Booking successful:", response.data);
  
      setBookedSeats((prev) => ({
        ...prev,
        [seatNumber]: { name, contact, token },
      }));
  
      setSelectedSeat(seatNumber);
  
      alert('Seat booked successfully!');
  
      navigate('/userdetails', {
        state: { seat: seatNumber, name, contact, token },
      });
    } catch (error) {
      console.error("🔥 Booking failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || 'Booking failed. Please try again later.');
    }
  };
  const renderGrid = () => {
    const layout = [];

    layout.push(<div key="entrance" className="entrance">Office Entrance</div>);

    for (let i = 0; i < seats.length; i++) {
      if (i === 5) layout.push(<div key="water" className="amenity water-cooler">Water Cooler</div>);
      if (i === 10) layout.push(<div key="vending" className="amenity vending-machine">Vending Machine</div>);
      if (i === 15) layout.push(<div key="resting" className="amenity resting-area">Resting Area</div>);
      if (i === 20) layout.push(<div key="meeting" className="amenity meeting-room">Meeting Room</div>);
      if (i === 25) layout.push(<div key="printer" className="amenity printer-station">Printer Station</div>);

      const seatNumber = seats[i];
      let status = 'available';
      if (bookedSeats[seatNumber]) status = 'booked';
      if (selectedSeat === seatNumber) status = 'selected';

      layout.push(
        <div
          key={seatNumber}
          className={`seat ${status}`}
          onClick={() => handleSeatClick(seatNumber)}
        />
      );
    }

    layout.push(<div key="exit" className="exit">Office Exit</div>);
    return layout;
  };

  return (
    <div>
      <h1>Select Any Seat </h1>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 30px',
        marginTop: '-40px',
        marginBottom: '10px'
      }}>
        <button
          onClick={() => navigate('/seatcancellation')}
          style={{
            width: '130px',
            height: '45px',
            fontSize: '14px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Click to cancel Seat
        </button>
      </div>

      <div className="office-container">
        {renderGrid()}
      </div>
    </div>
  );
};

export default App;