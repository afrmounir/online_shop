const crypto = require('crypto');

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
      .catch(err => console.log(err));
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
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  User
    .findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
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
    .catch(err => console.log(err));
};