const userDetailsModel = require('../models/userdetails_model');
const { validationResult } = require('express-validator');
const { sendCancellationConfirmation } = require('../services/emailserviceforcancelseat'); // Import email service

module.exports.cancelSeat = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, contact } = req.body; // Removed seatnumber

    try {
        // Find the booking based on name and contact
        const seatEntry = await userDetailsModel.findOne({ contact });
        console.log('Database Entry:', seatEntry);

        if (!seatEntry) {
            return res.status(404).json({ message: 'Booking not found or already cancelled.' });
        }

        if (seatEntry.name !== name) {
            return res.status(403).json({ message: 'Name does not match the record.' });
        }

        // Ensure date, startTime, and endTime exist in the database entry
        const { date, startTime, endTime } = seatEntry;
        if (!date || !startTime || !endTime) {
            console.error('Missing date, startTime, or endTime in the database entry.');
            return res.status(500).json({ message: 'Booking details are incomplete. Please contact support.' });
        }

        console.log('Booking Details:', { date, startTime, endTime }); // Debugging log

        const registrationTime = new Date(seatEntry.registrationTime);
        const currentTime = new Date();
        const timeDifference = (currentTime - registrationTime) / (1000 * 60 * 60); // Time difference in hours

        if (timeDifference > 24) {
            return res.status(403).json({ message: 'Cancellation period expired. Bookings can only be cancelled within 24 hours of registration.' });
        }

        // Delete the booking
        await userDetailsModel.deleteOne({ contact });

        // Send cancellation confirmation email
        try {
            await sendCancellationConfirmation(seatEntry.email, date, startTime, endTime);
        } catch (emailError) {
            console.error('Error sending cancellation email:', emailError.message);
            return res.status(500).json({ message: 'Booking cancelled, but failed to send confirmation email.' });
        }

        res.status(200).json({ message: 'Booking cancelled successfully!' });
    } catch (error) {
        console.error('Error cancelling booking:', error.message);
        res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
    }
};