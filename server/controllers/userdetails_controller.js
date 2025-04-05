const { validationResult } = require('express-validator');
const BookingModel = require('../models/userdetails_model');
const bookseatservice = require('../services/userdetailsservice');
const { sendBookingConfirmation } = require('../services/emailservice');

module.exports.user_details = async (req, res) => {
    try {
        console.log('Incoming request body:', req.body); // Debugging log

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()); // Debugging log
            return res.status(400).json({ error: errors.array() });
        }

        // Extract fields from the request body
        const { name, contact, date, startTime, endTime, email } = req.body;

        console.log('Extracted fields:', { name, contact, date, startTime, endTime, email }); // Debugging log

        // Ensure all required fields are present
        if (!name || !contact || !date || !startTime || !endTime || !email) {
            console.log('Missing required fields'); // Debugging log
            return res.status(400).json({
                error: [
                    { type: "field", msg: "All fields are required", location: "body" }
                ]
            });
        }

        // Validate date format
        const bookingDate = new Date(date);
        const currentDate = new Date();
        const maxBookingDate = new Date();
        maxBookingDate.setDate(currentDate.getDate() + 15);

        bookingDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        maxBookingDate.setHours(0, 0, 0, 0);

        if (isNaN(bookingDate.getTime())) {
            console.log('Invalid date format:', date); // Debugging log
            return res.status(400).json({ message: 'Invalid date format. Please provide a valid date.' });
        }

        // Ensure the booking date is within the allowed range
        if (bookingDate < currentDate || bookingDate > maxBookingDate) {
            console.log('Booking date out of range:', bookingDate); // Debugging log
            return res.status(400).json({ message: 'You can only book a seat within the next 15 days.' });
        }

        // Validate time difference (at least 15 minutes)
        const startTimeObj = new Date(`1970-01-01T${startTime}`);
        const endTimeObj = new Date(`1970-01-01T${endTime}`);
        const timeDifference = (endTimeObj - startTimeObj) / (1000 * 60); // Difference in minutes

        if (timeDifference < 15) {
            console.log('Booking duration is less than 15 minutes'); // Debugging log
            return res.status(400).json({ message: 'Seat must be booked for at least 15 minutes.' });
        }

        // Check for overlapping bookings
        console.log('Checking for overlapping bookings...'); // Debugging log
        const overlappingBooking = await BookingModel.findOne({
            date,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } } // Overlapping time range
            ]
        });

        if (overlappingBooking) {
            console.log('Overlapping booking found:', overlappingBooking); // Debugging log
            return res.status(400).json({
                message: `Seat already booked by ${overlappingBooking.name}, Contact: ${overlappingBooking.contact}`
            });
        }

        // Check if the user has already booked a seat
        console.log('Checking if the user has already booked a seat...'); // Debugging log
        const existingUser = await BookingModel.findOne({ contact });

        if (existingUser) {
            console.log('User has already booked a seat:', existingUser); // Debugging log
            return res.status(400).json({ message: 'You cannot book a seat twice!' });
        }

        // Create a new booking
        console.log('Creating a new booking...'); // Debugging log
        const newBooking = await bookseatservice.createBooking({
            name,
            contact,
            date,
            startTime,
            endTime,
            email
        });

        console.log('New booking created:', newBooking); // Debugging log

        // Send booking confirmation email
        try {
            console.log('Sending booking confirmation email with details:');
            console.log('Email:', email);
            console.log('Date:', date);
            console.log('Start Time:', startTime);
            console.log('End Time:', endTime);

            await sendBookingConfirmation(email, date, startTime, endTime);
        } catch (emailError) {
            console.error('Error sending email:', emailError.message); // Debugging log
        }

        // Respond with success
        console.log('Booking successful, responding to client...'); // Debugging log
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
        console.error('Error selecting seat:', error.message); // Debugging log
        res.status(500).json({ error: 'Internal server error' });
    }
};