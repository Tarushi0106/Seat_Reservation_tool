const Seat = require('../models/seatregister_models');

const bookSeat = async (name, contact) => {
  const existing = await Seat.findOne(); // Only one seat can be booked

  if (existing) {
    return {
      success: false,
      message: `Seat is already booked by ${existing.name} (${existing.contact})`
    };
  }

  const newBooking = new Seat({ name, contact });
  await newBooking.save();

  return {
    success: true,
    message: `Seat booked successfully by ${name}.`
  };
};

const getBooking = async () => {
  return await Seat.findOne();
};

module.exports = { bookSeat, getBooking };
