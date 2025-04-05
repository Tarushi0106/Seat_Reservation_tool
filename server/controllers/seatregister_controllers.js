const Seat = require('../models/seatregister_models');

exports.bookSeat = async (req, res) => {
  const { name, contact, token, seat } = req.body;

  try {
    // Check if the seat is already booked
    const existingSeat = await Seat.findOne({ seat });

    if (existingSeat) {
      return res.status(409).json({ 
        message: `Seat already booked by ${existingSeat.name}`, 
        bookedBy: existingSeat 
      });
    }

    const newSeat = new Seat({ name, contact, token, seat });
    await newSeat.save();

    res.status(201).json({ message: 'Seat booked successfully', seat: newSeat });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find({}, 'seat name contact token'); // only return relevant fields
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};