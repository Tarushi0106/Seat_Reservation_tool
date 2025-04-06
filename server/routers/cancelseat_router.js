const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { cancelSeat } = require('../controllers/cancelseat_controller');

router.post(
  '/cancelseat',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('contact').notEmpty().withMessage('Contact number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  cancelSeat
);

module.exports = router;
