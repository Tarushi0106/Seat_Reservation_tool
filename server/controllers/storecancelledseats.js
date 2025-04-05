// // In your controller
// const CancelledSeat = require('../models/cancelledSeat_model');

// module.exports.getCancelledSeats = async (req, res) => {
//   try {
//     const cancelled = await CancelledSeat.find().sort({ cancelledAt: -1 });
//     res.status(200).json(cancelled);
//   } catch (err) {
//     console.error('Error fetching cancelled seats:', err.message);
//     res.status(500).json({ message: 'Failed to fetch cancelled seats.' });
//   }
// };
