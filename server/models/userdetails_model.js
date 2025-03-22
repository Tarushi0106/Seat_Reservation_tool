const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userdetails = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters long']
    },
    contact: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid contact number! It should be exactly 10 digits.`
        }
    },
    date: {
        type: String,
        unique: true,
        required: true,
        minlength: [5, 'Date must be at least 5 characters long']
    },
    time: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Time must be at least 5 characters long']
    },
    seatnumber: {
        type: String,
        required: true,
        unique: true,
        minlength: [2, 'seat number must be at least 2 characters long']
    }
});

const UserdetailsModel = mongoose.model('Userdetails', userdetails);

module.exports = UserdetailsModel;