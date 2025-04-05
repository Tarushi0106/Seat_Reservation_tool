const userDetailsModel = require('../models/userdetails_model');
const seatRegisterModel = require('../models/seatregister_models');

module.exports.cancelBooking = async ({ name, email, contact }) => {
    try {
        // STEP 1: Find all bookings for the user in userDetailsModel
        const userDetailsEntries = await userDetailsModel.find({ name, contact });
        if (!userDetailsEntries || userDetailsEntries.length === 0) {
            throw new Error('No bookings found for the provided details.');
        }

        // STEP 2: Delete all related entries from userDetailsModel
        await userDetailsModel.deleteMany({ name, contact });

        // STEP 3: Delete all related entries from seatRegisterModel
        await seatRegisterModel.deleteMany({ name, contact });

        return { success: true, message: 'All bookings cancelled successfully!' };
    } catch (error) {
        console.error('Error in cancelBooking service:', error.message);
        return { success: false, message: error.message };
    }
};