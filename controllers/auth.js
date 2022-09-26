const bcrypt = require('bcryptjs');

const User = require('../models/user');

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
    pageTitle: 'S\'inscrire'
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
        .then(() => res.redirect('/login'))
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};