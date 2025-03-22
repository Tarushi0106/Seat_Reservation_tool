const { body } = require('express-validator');
const controller = require('../controllers/seatregister_controllers');
const express = require('express');
const router = express.Router();

router.post('/register_seat', [
    body('seatnumber').notEmpty().withMessage('seatnumer is required'),
], controller.register_seat);

module.exports = router;