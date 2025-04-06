const userDetailsModel = require('../models/userdetails_model');
const { validationResult } = require('express-validator');
const { sendCancellationConfirmation } = require('../services/emailserviceforcancelseat'); // Import email service
const seatRegisterModel = require('../models/seatregister_models');

module.exports.cancelSeat = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, contact, seatnumber } = req.body;

  try {
    // Check in userDetailsModel
    const userDetailsEntry = await userDetailsModel.findOne({ contact, seatnumber });
    console.log('User Details Entry:', userDetailsEntry);

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

      await userDetailsModel.deleteOne({ contact, seatnumber });

      // Send cancellation confirmation email
      try {
        await sendCancellationConfirmation(userDetailsEntry.email, seatnumber);
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError.message);
        return res.status(500).json({ message: 'Seat cancelled, but failed to send confirmation email.' });
      }

      return res.status(200).json({ message: 'Seat cancelled successfully from user details!' });
    }

    // Check in seatRegisterModel
    const seatRegisterEntry = await seatRegisterModel.findOne({ contact, seatnumber });
    console.log('Seat Register Entry:', seatRegisterEntry);

    if (seatRegisterEntry) {
      if (seatRegisterEntry.name !== name) {
        return res.status(403).json({ message: 'Name does not match the record in seat register.' });
      }

      await seatRegisterModel.deleteOne({ contact, seatnumber });

      // Send cancellation confirmation email
      try {
        await sendCancellationConfirmation(seatRegisterEntry.email, seatnumber);
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError.message);
        return res.status(500).json({ message: 'Seat cancelled !' });
      }

      return res.status(200).json({ message: 'Seat cancelled successfully from seat register!' });
    }

    return res.status(404).json({ message: 'Seat not found in either database or already cancelled.' });
  } catch (error) {
    console.error('Error cancelling seat:', error.message);
    res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
  }
};
