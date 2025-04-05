const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seat: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Seat', seatSchema);
