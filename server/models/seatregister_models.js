const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    seatnumber: { type: String, required: true },
   });

module.exports = mongoose.model('SeatRegister', SeatSchema);
