const mongoose = require('mongoose');

const SeatRegisterSchema = new mongoose.Schema({
  seatnumber: {
    type: String,
    required: true,
    unique: true
  },

});

module.exports = mongoose.model('SeatRegister', SeatRegisterSchema);
