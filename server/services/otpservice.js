const model = require("../models/otpmodel");

module.exports.createotp = async ({ otp }) => {
    return await model.create({
        otp,
    });
};
