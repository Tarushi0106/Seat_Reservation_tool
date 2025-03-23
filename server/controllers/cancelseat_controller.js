const userDetailsModel = require('../models/userdetails_model');
const { validationResult } = require('express-validator');

module.exports.cancelSeat = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, contact, seatnumber } = req.body;

    try {
        const seatEntry = await userDetailsModel.findOne({ contact, seatnumber });
        console.log('Database Entry:', seatEntry);

        if (!seatEntry) {
            return res.status(404).json({ message: 'Seat not found or already cancelled.' });
        }

        if (seatEntry.name !== name) {
            return res.status(403).json({ message: 'Name does not match the record.' });
        }

       
        const registrationTime = new Date(seatEntry.registrationTime);
        const currentTime = new Date();
        const timeDifference = (currentTime - registrationTime) / (1000 * 60 * 60); 

        if (timeDifference > 24) {
            return res.status(403).json({ message: 'Cancellation period expired. Seats can only be cancelled within 24 hours of registration.' });
        }

        await userDetailsModel.deleteOne({ contact, seatnumber });

        res.status(200).json({ message: 'Seat cancelled successfully!' });
    } catch (error) {
        console.error('Error cancelling seat:', error.message);
        res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
    }
};
