const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user_controller');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/register', [
  
  body('firstname').notEmpty().withMessage('First name is required'),
  body('lastname').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.register_user);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.login_user);

module.exports = router;