const userDetailsModel = require('../models/userdetails_model');
const seatRegisterModel = require('../models/seatregister_models');
const cancelSeatModel = require('../models/cancelseat_model');

module.exports.cancelBooking = async ({ name, email, contact }) => {
  try {
    const userDetailsEntries = await userDetailsModel.find({ name, contact, email });

    if (!userDetailsEntries || userDetailsEntries.length === 0) {
      throw new Error('No bookings found for the provided details.');
    }

    const cancelledSeats = [];

    for (const entry of userDetailsEntries) {
      const seatToCancel = await seatRegisterModel.findOne({
        name: entry.name,
        contact: entry.contact,
        seat: entry.seatnumber
      });

      if (seatToCancel) {
        await seatRegisterModel.deleteOne({ _id: seatToCancel._id }); // ✅ delete from seatRegister
      }

      cancelledSeats.push({
        name: entry.name,
        contact: entry.contact,
        email: entry.email,
        seat: entry.seatnumber,
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        cancellationTime: new Date()
      });
    }

    await cancelSeatModel.insertMany(cancelledSeats);                  // ✅ Log cancelled seats
    await userDetailsModel.deleteMany({ name, contact, email });       // ✅ Delete from userDetails

    return {
      success: true,
      message: 'All bookings cancelled successfully and saved to the cancelled seats section!',
      cancelledSeats
    };

  } catch (error) {
    console.error('Error in cancelBooking service:', error.message);
    return { success: false, message: error.message };
  }
};
