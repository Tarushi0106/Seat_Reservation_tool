const userDetailsModel = require('../models/userdetails_model');
const seatRegisterModel = require('../models/seatregister_models');
const cancelSeatModel = require('../models/cancelseat_model');
const { validationResult } = require('express-validator');
const { sendCancellationConfirmation } = require('../services/emailserviceforcancelseat');

module.exports.cancelSeat = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, contact, email } = req.body;

  try {
    // Check in userDetailsModel
    const userDetailsEntries = await userDetailsModel.find({ name, contact });
    console.log('User Details Entries:', userDetailsEntries);

    if (userDetailsEntries.length > 0) {
      const cancelledSeats = [];

      for (const entry of userDetailsEntries) {
        // Save the canceled seat to cancelSeatModel
        const canceledSeat = new cancelSeatModel({
          name: entry.name,
          contact: entry.contact,
          email: entry.email,
          seat: entry.seat || null, // Include seat if it exists
          date: entry.date,
          startTime: entry.startTime,
          endTime: entry.endTime,
          cancellationTime: new Date()
        });
        await canceledSeat.save();
        cancelledSeats.push(canceledSeat);

        // Delete the entry from userDetailsModel
        await userDetailsModel.deleteOne({ _id: entry._id });
      }

      // Send cancellation confirmation email
      try {
        await sendCancellationConfirmation(email, 'N/A', 'N/A', 'N/A');
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError.message);
      }

      return res.status(200).json({
        message: 'Seats cancelled successfully!',
        cancelledSeats
      });
    }

    // Check in seatRegisterModel
    const seatRegisterEntries = await seatRegisterModel.find({ name, contact });
    console.log('Seat Register Entries:', seatRegisterEntries);

    if (seatRegisterEntries.length > 0) {
      const cancelledSeats = [];

      for (const entry of seatRegisterEntries) {
        // Save the canceled seat to cancelSeatModel
        const canceledSeat = new cancelSeatModel({
          name: entry.name,
          contact: entry.contact,
          email: entry.email || null, // Include email if it exists
          seat: entry.seat,
          date: entry.date,
          startTime: entry.startTime,
          endTime: entry.endTime,
          cancellationTime: new Date()
        });
        await canceledSeat.save();
        cancelledSeats.push(canceledSeat);

        // Delete the entry from seatRegisterModel
        await seatRegisterModel.deleteOne({ _id: entry._id });
      }

      // Send cancellation confirmation email
      try {
        await sendCancellationConfirmation(email, 'N/A', 'N/A', 'N/A');
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError.message);
      }

      return res.status(200).json({
        message: 'Seats cancelled successfully!',
        cancelledSeats
      });
    }

    return res.status(404).json({ message: 'No bookings found for the provided details.' });
  } catch (error) {
    console.error('Error cancelling seat:', error.message);
    res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
};