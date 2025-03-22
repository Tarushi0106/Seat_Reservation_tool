const { validationResult } = require('express-validator');
const BookingModel = require('../models/userdetails_model');
const bookseatservice = require('../services/userdetailsservice');

module.exports.user_details = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { name, contact, date, time, seatnumber } = req.body;

        // Ensure the booking date is within the next 15 days
        const bookingDate = new Date(date);
        const currentDate = new Date();  // Corrected: Now uses the actual current date
        const maxBookingDate = new Date();
        maxBookingDate.setDate(currentDate.getDate() + 15);
        
        // Reset the time part of the dates to ensure accurate comparison
        bookingDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        maxBookingDate.setHours(0, 0, 0, 0);
        
        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Please provide a valid date.' });
        }
        
        if (bookingDate < currentDate || bookingDate > maxBookingDate) {
            return res.status(400).json({ message: 'You can only book a seat within the next 15 days.' });
        }
        
       

        const isUserAlreadyExists = await BookingModel.findOne({ contact });
        if (isUserAlreadyExists) {
            return res.status(400).json({ message: 'You cannot book a seat twice!' });
        }

        const isSeatAlreadyBooked = await BookingModel.findOne({ seatnumber, date, time });
        if (isSeatAlreadyBooked) {
            return res.status(400).json({ 
                message: `This seat is already booked by ${isSeatAlreadyBooked.name} (Contact: ${isSeatAlreadyBooked.contact}) at the selected date and time.` 
            });
        }

        const newBooking = await bookseatservice.createBooking({
            name,
            contact,
            date,
            time,
            seatnumber, 
        });

        res.status(201).json({ 
            message: 'Seat booked successfully',
            bookingDetails: {
                name: newBooking.name,
                contact: newBooking.contact,
                date: newBooking.date,
                time: newBooking.time,
                seatnumber: newBooking.seatnumber
            }
        });

    } catch (error) {
        console.error('Error selecting seat:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};