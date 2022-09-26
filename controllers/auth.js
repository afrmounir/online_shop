const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');

let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "258f05746c315e",
    pass: "99a17f55e5e5e4"
  }
});

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Se Connecter',
    path: '/login',
    errorMessage: req.flash('error')
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'S\'inscrire',
    errorMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'E-mail ou Mot de passe incorrect');
        return res.redirect('/login');
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
          req.flash('error', 'E-mail ou Mot de passe incorrect');
          res.redirect('login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User
    .findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Cet e-mail est deja utilisé, veuillez en utiliser un different');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
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
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};