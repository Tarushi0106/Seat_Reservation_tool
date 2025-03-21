const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: [3, 'Full name must be at least 3 characters long']
    },
    lastname: {
        type: String,
        required: true,
        minlength: [3, 'Full name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long']
    },
    password: {
        type: String,
        required: true,
        select: false
    }
});

// Corrected token generation logic
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email },  // Fixed incorrect object structure
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    return token;
};


userSchema.methods.comparePassword = async function (enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.statics.hashPassword = async function (password) {  
    return await bcrypt.hash(password, 10);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;