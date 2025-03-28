const BookingModel = require('../models/userdetails_model'); // Import the BookingModel

module.exports.createBooking = async ({ name, email, contact, date, startTime, endTime, seatnumber }) => {
    const newBooking = new BookingModel({
        name,
        email,
        contact,
        date,
        startTime,
        endTime,
        seatnumber,
    });

    await newBooking.save();
    return newBooking;
};