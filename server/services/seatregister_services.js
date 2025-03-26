const models = require('../models/seatregister_models');

module.exports.createSeat = async ({ seatnumber, name, contact }) => {
  const seat = new models({
    seatnumber,
   
  });
  await seat.save();
  return seat;
};