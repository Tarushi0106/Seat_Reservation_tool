const BookingModel = require('../models/userdetails_model');

module.exports.createBooking = async ({ name, contact, date, time , seatnumber }) => {
    const newBooking = new BookingModel({
        name,
        contact,
        date,
        time,
        seatnumber,
    });

    await newBooking.save();
    return newBooking;
};