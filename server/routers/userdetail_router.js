const { body } = require('express-validator');
const controller = require('../controllers/userdetails_controller');
const express = require('express');
const router = express.Router();

router.post('/userdetails', [
    body('name').notEmpty().withMessage('Name is required'),
    body('contact')
        .notEmpty().withMessage('Contact is required')
        .isLength({ min: 10, max: 10 }).withMessage('Contact must be exactly 10 digits')
        .matches(/^\d{10}$/).withMessage('Contact must be exactly 10 digits'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
], controller.user_details);

module.exports = router;