const Seat = require('../models/seatregister_models'); // Import seatregister_models
const UserDetails = require('../models/userdetails_model'); // Import userdetails_model

// Utility: Delete expired seats from both collections
const deleteExpiredSeats = async () => {
  const now = new Date();

  // Delete expired seats from seatregister_models
  const seats = await Seat.find();
  for (let s of seats) {
    const bookingEnd = new Date(`${s.date}T${s.endTime}`);
    if (bookingEnd < now) {
      await Seat.deleteOne({ _id: s._id });
      console.log(`Deleted expired seat from seatregister_models: ${s.seat}`);
    }
  }

  // Delete expired seats from userdetails_model
  const userDetails = await UserDetails.find();
  for (let u of userDetails) {
    const bookingEnd = new Date(`${u.date}T${u.endTime}`);
    if (bookingEnd < now) {
      await UserDetails.deleteOne({ _id: u._id });
      console.log(`Deleted expired seat from userdetails_model: ${u.seat}`);
    }
  }
};

// Book a seat
exports.bookSeat = async (req, res) => {
  const { seatId, name, contact, expiryTime } = req.body;

  console.log("[BOOK SEAT] Incoming request payload:", req.body);

  if (!seatId || !name || !contact || !expiryTime) {
    console.warn("[BOOK SEAT] Missing required fields.");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the seat is already booked
    const existingSeat = await Seat.findOne({ seatId });
    console.log("[BOOK SEAT] Existing seat:", existingSeat);

    if (existingSeat) {
      return res.status(409).json({ 
        message: `Seat already booked by ${existingSeat.name}`, 
        bookedBy: existingSeat 
      });
    }

    // Book the seat
    const newSeat = new Seat({
      seatId,
      name,
      contact,
      expiryTime: new Date(expiryTime),
    });
    await newSeat.save();

    res.status(201).json({ message: 'Seat booked successfully', booking: newSeat });
  } catch (err) {
    console.error("[BOOK SEAT] Error:", err.message);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Get all booked seats (removes expired ones first)
exports.getAllSeats = async (req, res) => {
  try {
    await deleteExpiredSeats(); // Clear out expired bookings from both collections

    const seats = await Seat.find({}, 'seat name contact token date startTime endTime');
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};