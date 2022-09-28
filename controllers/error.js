exports.get404 = (req, res, next) => {
  res.status(404).render('404', { 
    pageTitle: 'Page non trouvée',
    path: '/404'
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', { 
    pageTitle: 'Erreur 500',
    path: '/500'
  });
};