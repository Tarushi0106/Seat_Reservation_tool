const { body, validationResult } = require('express-validator');
const express = require('express');
const controller = require('../controllers/userdetails_controller');
const BookingModel = require('../models/userdetails_model');

const router = express.Router();

// Validation Rules
const validationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),
    body('contact')
        .notEmpty().withMessage('Contact is required')
        .isLength({ min: 10, max: 10 }).withMessage('Contact must be exactly 10 digits')
        .matches(/^\d{10}$/).withMessage('Contact must be exactly 10 digits'),
    body('date').notEmpty().withMessage('Date is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('startTime').custom((value, { req }) => {
        const startTime = new Date(`1970-01-01T${value}`);
        const endTime = new Date(`1970-01-01T${req.body.endTime}`);
        const timeDifference = (endTime - startTime) / (1000 * 60); 

        if (timeDifference < 15) {
            throw new Error('Seat must be booked for at least 15 minutes.');
        }
        return true;
    })
];

// Routes
router.post('/userdetails', validationRules, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, controller.user_details);

module.exports = router;