const mongoose = require('mongoose');

const cancelSeatSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  seat: String,
  date: String,
  startTime: String,
  endTime: String,
  cancellationTime: Date
}, { collection: 'cancelledseats' }); // 👈 force the collection name

module.exports = mongoose.model('CancelSeat', cancelSeatSchema);
