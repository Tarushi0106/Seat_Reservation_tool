const { createSeatBooking, getAllBookings } = require('../services/seatregister_services');
const Seat = require('../models/seatregister_models');
const UserDetails = require('../models/userdetails_model');

// Utility to delete expired seats
const deleteExpiredSeats = async () => {
  const now = new Date();

  const seats = await Seat.find();
  for (let s of seats) {
    const bookingEnd = new Date(`${s.date}T${s.endTime}`);
    if (bookingEnd < now) {
      await Seat.deleteOne({ _id: s._id });
      console.log(`Deleted expired seat from seatregister_models: ${s.seat}`);
    }
  }

  const userDetails = await UserDetails.find();
  for (let u of userDetails) {
    const bookingEnd = new Date(`${u.date}T${u.endTime}`);
    if (bookingEnd < now) {
      await UserDetails.deleteOne({ _id: u._id });
      console.log(`Deleted expired seat from userdetails_model: ${u.seat}`);
    }
  }
};

// Book a seat controller
exports.bookSeat = async (req, res) => {
  console.log("[BOOK SEAT] Incoming request payload:", req.body);

  const { name, contact, token, seat } = req.body;

  if (!name || !contact || seat === undefined || seat === null || !token) {
    console.warn("[BOOK SEAT] Missing required fields.");
    return res.status(400).json({
      message: 'All fields are required.',
      received: req.body, // Log the received payload for debugging
    });
  }

  try {
    const existingSeat = await Seat.findOne({ seat });

    if (existingSeat) {
      return res.status(409).json({
        message: `Seat ${seat} is already booked by ${existingSeat.name}.`,
        bookedBy: existingSeat,
      });
    }

    const booking = await createSeatBooking({ name, contact, token, seat });

    res.status(201).json({
      message: `Seat ${seat} booked successfully.`,
      booking,
    });
  } catch (error) {
    console.error('Error booking seat:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get all booked seats
exports.getAllSeats = async (req, res) => {
  try {
    await deleteExpiredSeats(); // Clear expired bookings
    const seats = await getAllBookings();
    res.status(200).json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};