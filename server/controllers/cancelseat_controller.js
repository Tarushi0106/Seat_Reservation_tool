const model = require('../models/cancelseat_model');
const { validationResult } = require('express-validator');

module.exports.cancelSeat = async (req, res) => {
    const { seatnumber } = req.body;

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if the seat exists in the database
        const seat = await model.findOne({ seatnumber });

        if (!seat) {
            return res.status(404).json({ message: 'Seat not found or already cancelled.' });
        }

        // Delete the seat entry
        await model.deleteOne({ seatnumber });

        res.status(200).json({ message: 'Seat cancelled successfully.' });
    } catch (error) {
        console.error('Error cancelling seat:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
