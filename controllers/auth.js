const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator')

const User = require('../models/user');

let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER, //"258f05746c315e",
    pass: process.env.MAILTRAP_PASSWORD //"99a17f55e5e5e4"
  }
});

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Se Connecter',
    path: '/login',
    errorMessage: req.flash('error'),
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'S\'inscrire',
    errorMessage: req.flash('error'),
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res
      .status(422)
      .render('auth/login', {
        path: '/login',
        pageTitle: 'Se Connecter',
        errorMessage: errors.array()[0].msg,
        oldInput: { email, password },
        validationErrors: errors.array()
      });
  }

  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        return res
          .status(422)
          .render('auth/login', {
            path: '/login',
            pageTitle: 'Se Connecter',
            errorMessage: 'E-mail ou Mot de passe incorrect',
            oldInput: { email, password },
            validationErrors: [] // to don't show exactly where is the error
          });
      }
      bcrypt
        .compare(password, user.password)
        .then(match => {
          if (match) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => { // make sure that the session is created before we continue
              console.log(err);
              res.redirect('/');
            });
          }
          return res
          .status(422)
          .render('auth/login', {
            path: '/login',
            pageTitle: 'Se Connecter',
            errorMessage: 'E-mail ou Mot de passe incorrect',
            oldInput: { email, password },
            validationErrors: [] // to don't show exactly where is the error
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render('auth/signup', {
        path: '/signup',
        pageTitle: 'S\'inscrire',
        errorMessage: errors.array()[0].msg,
        oldInput: { email, password, confirmPassword: req.body.confirmPassword },
        validationErrors: errors.array()
      });
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(() => {
      res.redirect('/login')
      return transporter.sendMail({
        from: '<online@shop.com>', // sender address
        to: email, // list of receivers
        subject: "Bienvenue Test", // Subject line
        text: "Inscription finalisée", // plain text body
        html: "<b>Inscription finalisée</b>", // html body
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Réinitialiser mot de passe',
    path: '/reset',
    errorMessage: req.flash('error')
  });
};

exports.postResetPassword = (req, res, next) => { // generate a token and send it to the user email to check if the email belong to the actual user who want to reset the password
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex'); //the buffer will pass hexadecimal values => to ASCII
    User
      .findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'Aucun compte existant');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000; //1H in milliseconds 
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        transporter.sendMail({
          from: '<online@shop.com>', // sender address
          to: req.body.email, // list of receivers
          subject: "Réinitialisez votre mot de passe", // Subject line
          html: `
            <p>Vous avez demandé à réinitialisé votre mot de passe</p>
            <p>Cliquez ici <a href="/http://localhost:3000/reset/${token}" >pour choisir un nouveau mot de passe</p>
          `, // html body
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User
    .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }) // { $gt } : greater than special operator
    .then(user => {
      res.render('auth/new-password', {
        pageTitle: 'Nouveau mot de passe',
        path: '/new-password',
        errorMessage: req.flash('error'),
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  User
    .findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId  // to ensure the user still has the token in the database
    })
    .then(user => {
      bcrypt.hash(password, 12)
        .then(hashedPassword => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save();
        });
    })
    .then(() => res.redirect('/login'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};