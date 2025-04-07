const SeatModel = require('../models/seatregister_models');

// Create a seat booking
module.exports.createSeatBooking = async ({ name, contact, token, seat }) => {
  console.log('Incoming seat booking data:', { name, contact, token, seat });

  const newSeat = await SeatModel.create({
    name,
    contact,
    token,
    seat
  });

  return newSeat;
};

// Get all seats
module.exports.getAllBookings = async () => {
  return await SeatModel.find({}, 'seat name contact token date startTime endTime');
};
