const mongoose = require('mongoose');

const cancelSeatSchema = new mongoose.Schema({
    seatnumber: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CancelledSeat', cancelSeatSchema);
