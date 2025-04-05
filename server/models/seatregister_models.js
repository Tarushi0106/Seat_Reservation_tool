// models/seatregister_models.js

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

// ✅ Let Mongoose use the default collection name: 'seats'
module.exports = mongoose.model('Seat', seatSchema);