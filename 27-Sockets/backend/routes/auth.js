const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email adess already exist');
          }
        });
      })
      .normalizeEmail(),
    body('password').isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

module.exports = router;
