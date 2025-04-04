import React, { useState, useEffect } from 'react';
import './seatregister.css';
import axios from 'axios';

const App = () => {
  const [bookedSeats, setBookedSeats] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const seats = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    axios.get('http://localhost:3000/user/seats')
      .then(res => setBookedSeats(res.data.reduce((acc, cur) => {
        acc[cur.seat] = cur;
        return acc;
      }, {})))
      .catch(console.error);
  }, []);

  const handleSeatClick = async (seatNumber) => {
    if (bookedSeats[seatNumber]) {
      const user = bookedSeats[seatNumber];
      alert(`Seat already booked by ${user.name} (${user.contact})`);
      return;
    }

    const name = prompt("Enter your name:");
    const contact = prompt("Enter your contact:");

    if (!name || !contact) return;

    try {
      await axios.post('http://localhost:3000/user/seats/book', {
        seat: seatNumber,
        name,
        contact,
      });

      setBookedSeats(prev => ({
        ...prev,
        [seatNumber]: { name, contact },
      }));

      setSelectedSeat(seatNumber);
    } catch (error) {
      alert('Booking failed.');
    }
  };

  const renderGrid = () => {
    const layout = [];

    // Add Entrance
    layout.push(<div key="entrance" className="entrance">Office Entrance</div>);

    for (let i = 0; i < seats.length; i++) {
      // Amenities
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

    // Add Exit
    layout.push(<div key="exit" className="exit">Office Exit</div>);

    return layout;
  };

  return (
    <div>
      <h1>Office Floor Seating Plan</h1>
      <div className="office-container">
        {renderGrid()}
      </div>
    </div>
  );
};

export default App;
