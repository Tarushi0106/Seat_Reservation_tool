const BookingModel = require('../models/userdetails_model');

module.exports.createBooking = async ({ name,email, contact, date, time , seatnumber }) => {
    const newBooking = new BookingModel({
        name,
        email,
        contact,
        date,
        time,
        seatnumber,
    });

    await newBooking.save();
    return newBooking;
};