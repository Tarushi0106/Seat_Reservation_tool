const userModel = require('../models/usermodel');

// Creating user :)
module.exports.createUser = async ({ firstname, lastname, password, email }) => {
    if (!firstname || !email || !password) {
        throw new Error("All fields are required");
    }

    const user = await userModel.create({ 
        fullname,
        email,
        password,
    });

    return user;
};