const models = require('../models/seatregister_models');
const { validationResult } = require('express-validator');
const services = require('../services/seatregister_services');

module.exports.register_seat = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const { seatnumber, name, contact } = req.body; // Make sure these are extracted properly

        const isSeatAlreadyExists = await models.findOne({ seatnumber });
        if (isSeatAlreadyExists) {
            return res.status(400).json({
                message: `Seat already selected by user: ${isSeatAlreadyExists.name} (Contact: ${isSeatAlreadyExists.contact})`
            });
        }

        const seat = await services.createSeat({ seatnumber, name, contact });

        res.status(201).json({
            message: 'Seat registered successfully',
            seatDetails: {
                seatnumber: seat.seatnumber,
                name: seat.name,
                contact: seat.contact
            }
        });
    } catch (error) {
        console.error('Error registering seat:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
