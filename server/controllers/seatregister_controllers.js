// controllers/seatController.js
const Seat = require('../models/seatregister_models');

exports.bookSeat = async (req, res) => {
  const { seat, name, contact, token } = req.body;

  console.log("Received booking request:", { seat, name, contact, token });

  // Validate input
  if (!seat || !name || !contact || !token) {
    console.error("Missing required fields in request body");
    return res.status(400).json({ message: 'All fields (seat, name, contact, token) are required.' });
  }

  try {
    // Check if the seat is already booked
    const alreadyBooked = await Seat.findOne({ seat });
    if (alreadyBooked) {
      console.warn(`Seat ${seat} is already booked by ${alreadyBooked.name}`);
      return res.status(409).json({
        message: `Seat already booked by ${alreadyBooked.name}, Contact: ${alreadyBooked.contact}`
      });
    }

    // Save new seat booking
    const seatEntry = new Seat({ seat, name, contact, token });
    await seatEntry.save();

    console.log(`Seat ${seat} booked successfully by ${name}`);
    res.status(201).json({ message: 'Seat booked successfully', seat: seatEntry });

  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    console.error("Fetching seats failed:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
