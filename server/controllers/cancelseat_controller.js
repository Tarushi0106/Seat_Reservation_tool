const { validationResult } = require('express-validator');
const { sendCancellationConfirmation } = require('../services/emailserviceforcancelseat');
const { cancelBooking } = require('../services/cancelseat_service'); // ✅ new import
const userDetailsModel = require('../models/userdetails_model');
const seatRegisterModel = require('../models/seatregister_models');

module.exports.cancelSeat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, contact, email } = req.body;

  try {
    // Check if user exists
    const userDetailsEntry = await userDetailsModel.findOne({ contact, email });
    const seatRegisterEntry = await seatRegisterModel.findOne({ contact, email });

    if (!userDetailsEntry && !seatRegisterEntry) {
      return res.status(404).json({ message: 'Seat not found in either database or already cancelled.' });
    }

    // If userDetailsEntry exists, validate registration time
    if (userDetailsEntry) {
      if (userDetailsEntry.name !== name) {
        return res.status(403).json({ message: 'Name does not match the record in user details.' });
      }

      const registrationTime = new Date(userDetailsEntry.registrationTime);
      const currentTime = new Date();
      const timeDifference = (currentTime - registrationTime) / (1000 * 60 * 60);

      if (timeDifference > 24) {
        return res.status(403).json({ message: 'Cancellation period expired. Seats can only be cancelled within 24 hours of registration.' });
      }
    }

    // ✅ Call the service to cancel bookings
    const cancelResult = await cancelBooking({ name, contact, email });

    // Send cancellation confirmation email (you can customize this per seat if needed)
    if (userDetailsEntry) {
      await sendCancellationConfirmation(email, userDetailsEntry.seatnumber);
    } else if (seatRegisterEntry) {
      await sendCancellationConfirmation(email, seatRegisterEntry.seatnumber);
    }

    return res.status(200).json({ message: cancelResult.message });
  } catch (error) {
    console.error('Error cancelling seat:', error.message);
    res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
};
