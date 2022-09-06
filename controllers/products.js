const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Ajouter Produit',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Boutique',
      path: '/'
    });
  });
};