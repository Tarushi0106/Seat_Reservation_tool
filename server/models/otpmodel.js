const mongoose = require("mongoose");

const otp = new mongoose.Schema({
    otp: { type: Number, required: true }
});

module.exports = mongoose.model("otp", otp);
