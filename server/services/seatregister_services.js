const Seat = require('../models/seatregister_models');

/**
 * Book a specific seat if it's not already booked.
 * @param {String} name - User's name.
 * @param {String} contact - User's contact number.
 * @param {String} token - Unique token for booking.
 * @param {Number} seat - Seat number to be booked.
 */
const bookSeat = async (name, contact, token, seat) => {
  const existing = await Seat.findOne({ seat });

  if (existing) {
    return {
      success: false,
      message: `Seat ${seat} is already booked by ${existing.name} (${existing.contact})`
    };
  }

  const newBooking = new Seat({ name, contact, token, seat });
  await newBooking.save();

  return {
    success: true,
    message: `Seat ${seat} booked successfully by ${name}.`,
    booking: newBooking
  };
};

/**
 * Get all bookings.
 * Returns array of seat objects with name, contact, seat number and token.
 */
const getAllBookings = async () => {
  return await Seat.find({}, 'seat name contact token');
};

module.exports = { bookSeat, getAllBookings };
