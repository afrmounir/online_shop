exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Se Connecter',
    path: '/login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
};
