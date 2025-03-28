const { body } = require('express-validator');
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
    body('seatnumber').notEmpty().withMessage('Seat number is required')
];

// Routes
router.post('/userdetails', validationRules, controller.user_details);

module.exports = router;