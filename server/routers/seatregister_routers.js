// routers/seatregister_routers.js
const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatregister_controllers');

router.post('/seats/book', seatController.bookSeat); // This is the route you need
router.get('/seats', seatController.getAllSeats);

module.exports = router;
