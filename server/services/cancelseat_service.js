const userDetailsModel = require('../models/userdetails_model');
const seatRegisterModel = require('../models/seatregister_models');
const cancelSeatModel = require('../models/cancelseat_model');

module.exports.cancelBooking = async ({ name, email, contact }) => {
  try {
    console.log('Cancel booking request received with:', { name, email, contact });

    // Find all bookings in userDetailsModel
    console.log('Querying userDetailsModel with:', { name, contact, email });
    const userDetailsEntries = await userDetailsModel.find({ name, contact, email });
    console.log('User Details Entries Found:', userDetailsEntries);

    if (!userDetailsEntries || userDetailsEntries.length === 0) {
      console.log('No bookings found in userDetailsModel for the provided details.');
      throw new Error('No bookings found for the provided details in userDetailsModel.');
    }

    const cancelledSeats = [];

    for (const entry of userDetailsEntries) {
      console.log('Processing userDetails entry:', entry);

      // Find the corresponding seat in seatRegisterModel
      console.log('Querying seatRegisterModel with:', { name: entry.name, contact: entry.contact });
      const seatToCancel = await seatRegisterModel.findOne({
        name: entry.name,
        contact: entry.contact
      });
      console.log('Seat Found in seatRegisterModel:', seatToCancel);

      // Delete the seat from seatRegisterModel if it exists
      if (seatToCancel) {
        console.log('Deleting seat from seatRegisterModel with _id:', seatToCancel._id);
        await seatRegisterModel.deleteOne({ _id: seatToCancel._id });
        console.log('Seat deleted from seatRegisterModel:', seatToCancel.seat);
      } else {
        console.log('No corresponding seat found in seatRegisterModel for:', entry);
      }

      // Add the canceled seat to the cancelledSeats array
      const canceledSeat = {
        name: entry.name,
        contact: entry.contact,
        email: entry.email,
        seat: seatToCancel ? seatToCancel.seat : null, // Include seat if it exists
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        cancellationTime: new Date()
      };
      console.log('Adding canceled seat to cancelledSeats array:', canceledSeat);
      cancelledSeats.push(canceledSeat);
    }

    // Save all canceled seats to cancelSeatModel
    console.log('Saving cancelled seats to cancelSeatModel:', cancelledSeats);
    await cancelSeatModel.insertMany(cancelledSeats);
    console.log('Cancelled seats saved to cancelSeatModel.');

    // Delete all bookings from userDetailsModel
    console.log('Deleting all bookings from userDetailsModel with:', { name, contact, email });
    await userDetailsModel.deleteMany({ name, contact, email });
    console.log('All bookings deleted from userDetailsModel.');

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