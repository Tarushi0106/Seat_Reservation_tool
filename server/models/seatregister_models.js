const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    seatnumber: { type: String, required: true },
    name: { type: String, required: true },   // Confirm this field exists
    contact: { type: String, required: true } // Confirm this field exists
});

module.exports = mongoose.model('SeatRegister', SeatSchema);
