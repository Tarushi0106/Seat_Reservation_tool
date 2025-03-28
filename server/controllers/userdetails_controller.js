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
        const { name, contact, date, startTime, endTime, seatnumber, email } = req.body;

        console.log('Extracted fields:', { name, contact, date, startTime, endTime, seatnumber, email }); // Debugging log

        // Ensure all required fields are present
        if (!name || !contact || !date || !startTime || !endTime || !seatnumber || !email) {
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

        // Check for existing bookings
        console.log('Checking for existing bookings...'); // Debugging log
        const [existingUser, existingSeat] = await Promise.all([
            BookingModel.findOne({ contact }),
            BookingModel.findOne({
                seatnumber,
                date,
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: startTime } } // Check for overlapping times
                ]
            })
        ]);

        if (existingUser) {
            console.log('Existing user found:', existingUser); // Debugging log
            return res.status(400).json({ message: 'You cannot book a seat twice!' });
        }

        if (existingSeat) {
            console.log('Seat already booked:', existingSeat); // Debugging log
            return res.status(400).json({
                message: `This seat is already booked by ${existingSeat.name} (Contact: ${existingSeat.contact}) at the selected date and time.`
            });
        }

        // Create a new booking
        console.log('Creating a new booking...'); // Debugging log
        const newBooking = await bookseatservice.createBooking({
            name,
            contact,
            date,
            startTime,
            endTime,
            seatnumber,
            email
        });

        console.log('New booking created:', newBooking); // Debugging log

        // Send booking confirmation email
        try {
            console.log('Sending booking confirmation email to:', email); // Debugging log
            await sendBookingConfirmation(email, seatnumber);
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
                endTime: newBooking.endTime,
                seatnumber: newBooking.seatnumber
            }
        });

    } catch (error) {
        console.error('Error selecting seat:', error.message); // Debugging log
        res.status(500).json({ error: 'Internal server error' });
    }
};