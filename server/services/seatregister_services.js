// const userModel = require('../models/seatregister_models');

// // Creating a seat
// module.exports.createSeat = async ({ seatnumber }) => {
//     try {
//         console.log('Incoming data:', { seatnumber });

//         const seat = await userModel.create({ seatnumber });

//         console.log(`Seat successfully created: Seat Number - ${seat.seatnumber}`);
//         return seat;
//     } catch (error) {
//         console.error('Error creating seat:', error.message);
//         throw new Error('Failed to create seat');
//     }
// };

const userModel = require('../models/seatregister_models');

module.exports.createSeat = async ({ seatnumber, name, contact }) => {
    return await userModel.create({ 
        seatnumber,
        name,     // Ensure these fields are being passed
        contact
    });
};
