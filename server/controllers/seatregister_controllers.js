const models = require('../models/seatregister_models');

const { validationResult } = require('express-validator');
const services = require('../services/seatregister_services'); 
const jwt = require('jsonwebtoken'); 

module.exports.register_seat = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { seatnumber } = req.body;

        // Check if the seat already exists
        const isSeatAlreadyExists = await models.findOne({ seatnumber });
        console.log('Seat already exists:', isSeatAlreadyExists); // Add this line to debug

        if (isSeatAlreadyExists) {
            return res.status(400).json({
                message: `Seat already selected by user: ${isSeatAlreadyExists.name} (Contact: ${isSeatAlreadyExists.contact})`
            });
        }

        // Create seat entry
        const seat = await services.createSeat({ seatnumber });

        // Generate token for successful registration
        const token = jwt.sign({ seatId: seat._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ seat, token });  // Token added
    } catch (error) {
        console.error('Error registering seat:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};