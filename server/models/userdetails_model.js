const mongoose = require('mongoose');

const userdetails = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    contact: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /^\d{10}$/.test(v),
            message: props => `${props.value} is not a valid contact number!`
        }
    },
    date: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    seatnumber: { type: String, required: true }
}, { timestamps: true });

userdetails.index({ date: 1, startTime: 1, endTime: 1, seatnumber: 1 }, { unique: true });

const BookingModel = mongoose.model('Userdetails', userdetails);

module.exports = BookingModel;
