const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { cancelSeat } = require('../controllers/cancelseat_controller');

router.post(
    '/cancelseat',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('contact').notEmpty().withMessage('Contact number is required'),
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email address')
    ],
    cancelSeat
);

module.exports = router;