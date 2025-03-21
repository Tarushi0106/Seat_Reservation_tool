const jwt = require('jsonwebtoken');
const UserModel = require('../models/usermodel');

module.exports.authuser = async (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
                ? req.headers.authorization.split(' ')[1]
                : null);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized user - Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded._id) {
            return res.status(401).json({ message: "Token payload invalid - User ID missing" });
        }

        const user = await UserModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized user - User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Token/Authentication Error:', err.message);
        return res.status(401).json({ message: "Unauthorized user" });
    }
};
