exports.getLogin = (req, res, next) => {
  console.log(req.get('Cookie').split(';')[0]);
  res.render('auth/login', {
    pageTitle: 'Se Connecter',
    path: '/login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  res.cookie('loggedIn', true);
  res.redirect('/');
};
