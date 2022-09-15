const Product = require('../models/products');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Boutique',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Produits',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: 'Détails du produit',
        path: '/products'
      })
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart; // make the cart available in the nested Product
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product
      if (products) {
        product = products[0];
      }
      let newQuantity = 1;
      if (product) {
        //...
      }
      return Product
        .findByPk(productId)
        .then(product => {
          return fetchedCart.addProduct(product, { through: { quantity: newQuantity } }); // say to sequelize which model to use in in-between model and for that table what additional information to set the values in there
        })
        .catch(err => console.log(err));
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Panier',
        path: '/cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
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