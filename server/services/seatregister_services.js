const userModel = require('../models/seatregister_models');

module.exports.createSeat = async ({ seatnumber, name, contact }) => {
    return await userModel.create({ 
        seatnumber,
    });
};
