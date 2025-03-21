const userModel = require('../models/usermodel');

// Creating user :)
module.exports.createUser = async ({ firstname, lastname, password, email }) => {
    console.log('Incoming data:', { firstname, lastname, email, password });

    const user = await userModel.create({ 
        firstname,
        lastname,
        email,
        password,
    });

    return user;
};