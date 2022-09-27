const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
  '/signup',
  [
    check('email', 'Veuillez entrer un email valide.')
      .isEmail()
      .custom((value, { req }) => {
        return User
          .findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Cet e-mail est deja utilisé, veuillez en utiliser un different'); // async validation, we have to reach out database
            }
          });
      }),
    check('password', 'Veuillez entrez un mot de passe d\'au moins 5 caractères')
      .isLength({ min: 5 }),
    check('password', 'Les mots de passe doivent correspondent')
      .equals('confirmPassword')
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getResetPassword)

router.post('/reset', authController.postResetPassword);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword)

module.exports = router;