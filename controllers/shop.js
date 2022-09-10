const Product = require('../models/products');
const Cart = require('../models/cart');

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
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: 'Détails du produit',
      path: '/products'
    })
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for(product of products) { //to check if a product is also in the cart because a product might have been deleted or updated while the item was in the user's cart
        const cartProductData = cart.products.find(p => p.id === product.id);
        if(cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Panier',
        path: '/cart',
        products: cartProducts
      });
    });
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