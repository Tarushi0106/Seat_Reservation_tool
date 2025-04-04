const BookingModel = require('../models/userdetails_model'); 

module.exports.createBooking = async ({ name, email, contact, date, startTime, endTime}) => {
    const newBooking = new BookingModel({
        name,
        email,
        contact,
        date,
        startTime,
        endTime,
    });

    await newBooking.save();
    return newBooking;
};