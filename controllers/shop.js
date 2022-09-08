const Product = require('../models/products');

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Boutique',
      path: '/'
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Produits',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {  
    pageTitle: 'Panier',
    path: '/cart'
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {  
    pageTitle: 'Mes Commandes',
    path: '/orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {  
    pageTitle: 'Total',
    path: '/checkout'
  });
};