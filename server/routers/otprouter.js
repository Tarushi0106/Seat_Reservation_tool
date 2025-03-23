const express = require('express');
const { body } = require('express-validator');
const otpcontroller = require('../controllers/otpcontroller');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();


router.post('/send-otp', [
    body('email').isEmail().withMessage('Valid email is required')
], generateOTP);

router.post('/verify-otp', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').notEmpty().withMessage('OTP is required')
], verifyOTP);

module.exports = router;
