const BookingModel = require('../models/userdetails_model');

module.exports.createBooking = async ({ name, contact, date, time }) => {
    const newBooking = new BookingModel({
        name,
        contact,
        date,
        time,
    });

    await newBooking.save();
    return newBooking;
};