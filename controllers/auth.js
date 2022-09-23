exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Se Connecter',
    path: '/login'
  });
};
