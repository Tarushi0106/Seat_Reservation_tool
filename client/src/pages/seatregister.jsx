import React, { useState } from 'react';
import './seatregister.css';

const SeatRegister = () => {
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

{/* <a href="https://www.flaticon.com/free-icons/seat" title="seat icons">Seat icons created by Pixel perfect - Flaticon</a> */}
    
    const seats = [
        'A1', 'A2', 'A3', 'A4',
        'B1', 'B2', 'B3', 'B4',
        'C1', 'C2', 'C3', 'C4'
    ];

    const handleSeatSelection = (seat) => {
        if (!bookedSeats.includes(seat)) {
            setSelectedSeat(seat);
        }
    };

    const handleBooking = (e) => {
        e.preventDefault();
        if (selectedSeat && !bookedSeats.includes(selectedSeat)) {
            setBookedSeats([...bookedSeats, selectedSeat]);
            setSelectedSeat(null); // Clear selection after booking
            alert(`Seat ${selectedSeat} booked successfully!`);
        }
    };

    return (
        <div className="seat-register-container">
            <h1>🎯 Seat Registration</h1>

            <div className="seat-map">
                {seats.map((seat) => (
                    <div
                        key={seat}
                        className={`seat 
                            ${bookedSeats.includes(seat) ? 'booked' : 
                            selectedSeat === seat ? 'selected' : ''}`}
                        onClick={() => handleSeatSelection(seat)}
                    >
                        {seat}
                    </div>
                ))}
            </div>

            {selectedSeat && !bookedSeats.includes(selectedSeat) && (
                <div className="details-section">
                    <h2>Selected Seat: {selectedSeat}</h2>

                    <form className="user-form" onSubmit={handleBooking}>
                        <label>
                            Full Name:
                            <input type="text" placeholder="Enter your name" required />
                        </label>

                        <label>
                            Phone number:
                            <input type="number" placeholder="Enter your phone number" required />
                        </label>

                        <label>
                            Select Date:
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                required 
                            />
                        </label>

                        <label>
                            Select Time:
                            <input 
                                type="time" 
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                required 
                            />
                        </label>

                        <button type="submit" className="btn">Confirm Booking</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SeatRegister;
