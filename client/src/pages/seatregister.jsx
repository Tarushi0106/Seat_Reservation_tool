import React, { useState, useEffect } from 'react';
import './seatregister.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const App = () => {
  const [bookedSeats, setBookedSeats] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const seats = Array.from({ length: 30 }, (_, i) => i + 1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:3000/user/seats')
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
    // 🔴 Seat is already booked
    if (bookedSeats[seatNumber]) {
      const existingUser = bookedSeats[seatNumber];
      alert(`Seat already booked by:\n\nName: ${existingUser.name}\nContact: ${existingUser.contact}`);
      return;
    }
  
    // 🟢 Seat is available — booking flow
    const name = prompt("Enter your name:");
    const contact = prompt("Enter your contact:");
  
    if (!name || !contact) return;
  
    const token = crypto.randomUUID();
  
    try {
      await axios.post('https://seat-reservation-tool.onrender.com/user/seats/book', {
        seat: seatNumber,
        name,
        contact,
        token,
      });
  
      setBookedSeats(prev => ({
        ...prev,
        [seatNumber]: { name, contact, token },
      }));
  
      setSelectedSeat(seatNumber);
  
      localStorage.setItem(`seat_token_${seatNumber}`, token);
  
      navigate('/userdetails', {
        state: { seat: seatNumber, name, contact, token }
      });
  
    } catch (error) {
      alert('Booking failed.');
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