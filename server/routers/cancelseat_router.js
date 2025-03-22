const express = require('express');
const router = express.Router();
const { cancelSeat } = require('../controllers/cancelseat_controller');

// Correct the method to DELETE and use a dynamic parameter
router.delete('/cancel_seat/:seatnumber', cancelSeat);

module.exports = router;
