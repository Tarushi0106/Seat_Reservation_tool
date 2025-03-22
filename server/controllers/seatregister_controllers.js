const models = require('../models/seatregister_models');
const { validationResult } = require('express-validator');
const services = require('../services/seatregister_services'); // Corrected import
const controllers = require('./userdetails_controller');

module.exports.register_seat = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { seatnumber } = req.body;

        // Check if the seat already exists
        const isSeatAlreadyExists = await models.findOne({ seatnumber });
        if (isSeatAlreadyExists) {
            return res.status(400).json({
                message: `Seat already selected by user: ${isSeatAlreadyExists.name} (Contact: ${isSeatAlreadyExists.contact})`
            });
        }

        // Corrected the service function call
        const seat = await services.createSeat({ seatnumber });

        res.status(201).json({ seat });
    } catch (error) {
        console.error('Error registering seat:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
