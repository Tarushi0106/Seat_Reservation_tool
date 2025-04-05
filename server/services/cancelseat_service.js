const userDetailsModel = require('../models/userdetails_model');
const seatRegisterModel = require('../models/seatregister_models');
const cancelSeatModel = require('../models/cancelseat_model');

module.exports.cancelBooking = async ({ name, email, contact }) => {
    try {
        // STEP 1: Find all bookings for the user in userDetailsModel
        const userDetailsEntries = await userDetailsModel.find({ name, contact });
        if (!userDetailsEntries || userDetailsEntries.length === 0) {
            throw new Error('No bookings found for the provided details.');
        }

        // STEP 2: Save all canceled bookings to cancelSeatModel
        const canceledSeats = userDetailsEntries.map(entry => ({
            name: entry.name,
            contact: entry.contact,
            email: entry.email,
            seat: entry.seat, // Assuming `seat` exists in userDetailsModel
            date: entry.date, // Assuming `date` exists in userDetailsModel
            startTime: entry.startTime, // Assuming `startTime` exists in userDetailsModel
            endTime: entry.endTime, // Assuming `endTime` exists in userDetailsModel
            cancellationTime: new Date() // Add a timestamp for when the cancellation occurred
        }));
        await cancelSeatModel.insertMany(canceledSeats);

        // STEP 3: Delete all related entries from userDetailsModel
        await userDetailsModel.deleteMany({ name, contact });

        // STEP 4: Delete all related entries from seatRegisterModel
        await seatRegisterModel.deleteMany({ name, contact });

        return { success: true, message: 'All bookings cancelled successfully and saved to the cancelled seats section!' };
    } catch (error) {
        console.error('Error in cancelBooking service:', error.message);
        return { success: false, message: error.message };
    }
};