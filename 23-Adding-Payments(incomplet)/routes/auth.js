const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      //here I set an specific error messsage for this check.
      //If I have another validation, i need to specifi the spefic error message for that one
      .withMessage('Please enter a valid email address'),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      //here I set an specific error messsage for this check.
      //If I have another validation, i need to specifi the spefic error message for that one
      .withMessage('Please enter a valid email address')
      .custom((value, {}) => {
        // if (value === 'test@test.com') {
        //   throw new Error('this email is forbidden');
        // }
        // return true;
        return User.findOne({ email: value }) //with this check, I'll return if the email is already in use
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'Email already in use, pick a different one please'
              );
            }
          });
      }),
    //.normalizeEmail(), //removes with space al set al the letter to lowercase
    body(
      //I'm specifying that the value to be validate, will be inside the body
      'password',
      //this error message here is generic for every vaidation in this field
      'Please enter a password with only numbers and text and at least 5 characters'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(), //removes the white spaces
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password have to match!');
        }
        return true;
      })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
