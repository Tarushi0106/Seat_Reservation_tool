const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user_controller');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();


router.post('/register', (req, res) => {
    res.send('User registered successfully');
});

router.post('/login', (req, res) => {
    res.send('User logged in successfully');
});

module.exports = router;
