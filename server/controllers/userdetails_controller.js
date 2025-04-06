const { validationResult } = require('express-validator');
const BookingModel = require('../models/userdetails_model');
const bookseatservice = require('../services/userdetailsservice');
const { sendBookingConfirmation } = require('../services/emailservice');

module.exports.user_details = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { name, contact, date, startTime, endTime, email } = req.body;

        if (!name || !contact || !date || !startTime || !endTime || !email) {
            return res.status(400).json({
                error: [{ msg: "All fields are required", location: "body" }]
            });
        }

        const bookingDate = new Date(date);
        const currentDate = new Date();
        const maxBookingDate = new Date();
        maxBookingDate.setDate(currentDate.getDate() + 15);

        bookingDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        maxBookingDate.setHours(0, 0, 0, 0);

        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Please provide a valid date.' });
        }

        if (bookingDate < currentDate || bookingDate > maxBookingDate) {
            return res.status(400).json({ message: 'You can only book a seat within the next 15 days.' });
        }

        const startTimeObj = new Date(`1970-01-01T${startTime}`);
        const endTimeObj = new Date(`1970-01-01T${endTime}`);
        const timeDifference = (endTimeObj - startTimeObj) / (1000 * 60);

        if (timeDifference < 15) {
            return res.status(400).json({ message: 'Seat must be booked for at least 15 minutes.' });
        }

        // ❌ Check if the same user has already booked any seat
        const sameUserBooking = await BookingModel.findOne({
            contact,
            date,
            startTime,
            endTime
        });

        if (sameUserBooking) {
            return res.status(400).json({
                message: 'You cannot book the same seat twice.'
            });
        }

        // ❌ Check if another user has already booked the same seat
        const existingBooking = await BookingModel.findOne({
            date,
            startTime,
            endTime,
            contact: { $ne: contact } // booked by someone else
        });

        if (existingBooking) {
            return res.status(400).json({
                message: `This seat is already booked by ${existingBooking.name} (Contact: ${existingBooking.contact}).`
            });
        }

        // ✅ Create the booking
        const newBooking = await bookseatservice.createBooking({
            name,
            contact,
            date,
            startTime,
            endTime,
            email
        });

        try {
            await sendBookingConfirmation(email, date, startTime, endTime);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        res.status(201).json({
            message: 'Seat booked successfully',
            bookingDetails: {
                name: newBooking.name,
                contact: newBooking.contact,
                date: newBooking.date,
                startTime: newBooking.startTime,
                endTime: newBooking.endTime
            }
        });

    } catch (error) {
        console.error('Unexpected error:', error.message);
        res.status(500).json({ error: 'Something went wrong while processing your booking. Please try again.' });
    }
};
