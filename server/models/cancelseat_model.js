const mongoose = require('mongoose');

const cancelSeatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true } 
});

module.exports = mongoose.model('cancelledSeat', cancelSeatSchema);

