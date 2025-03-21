const { validationResult } = require('express-validator');
const UserModel = require('../models/usermodel');
const UserService = require('../services/userservice');

module.exports.register_user = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        console.log(req.body);

        const { firstname, lastname, email, password } = req.body;

      
        const isUserAlreadyExists = await UserModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await UserModel.hashPassword(password);

        
        const user = await UserService.createUser({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

      console.log(user);
        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.login_user = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        console.log(req.body);

        const { email, password } = req.body;

       
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.status(200).json({ token, user });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
