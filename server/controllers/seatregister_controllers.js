// controllers/seatController.js
const Seat = require('../models/seatregister_models');

exports.bookSeat = async (req, res) => {
  const { name, contact } = req.body;

  try {
    const alreadyBooked = await Seat.findOne({ name, contact });

    if (alreadyBooked) {
      return res.status(409).json({ 
        message: `Seat already booked by ${alreadyBooked.name}, Contact: ${alreadyBooked.contact}` 
      });
    }

    const seat = new Seat({ name, contact });
    await seat.save();

    res.status(201).json({ message: 'Seat booked successfully', seat });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
