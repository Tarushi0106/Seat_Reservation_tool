const userDetailsModel = require('../models/userdetails_model');
const seatRegisterModel = require('../models/seatregister_models');
const cancelSeatModel = require('../models/cancelseat_model');

module.exports.cancelBooking = async ({ name, email, contact }) => {
  try {
    const userDetailsEntries = await userDetailsModel.find({ name, contact });
    if (!userDetailsEntries || userDetailsEntries.length === 0) {
      throw new Error('No bookings found for the provided details.');
    }

    const canceledSeats = userDetailsEntries.map(entry => ({
      name: entry.name,
      contact: entry.contact,
      email: entry.email,
      seat: entry.seatnumber,
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      cancellationTime: new Date()
    }));

    if (!canceledSeats || canceledSeats.length === 0) {
      throw new Error('No seats to cancel were found.');
    }

    await cancelSeatModel.insertMany(canceledSeats);
    await userDetailsModel.deleteMany({ name, contact });
    await seatRegisterModel.deleteMany({ name, contact });

    return {
      success: true,
      message: 'All bookings cancelled successfully and saved to the cancelled seats section!'
    };
  } catch (error) {
    console.error('Error in cancelBooking service:', error.message);
    return { success: false, message: error.message };
  }
};
