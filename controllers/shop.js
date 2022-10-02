const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product
    .find()
    .estimatedDocumentCount()
    .then(numProducts => {
      totalItems = numProducts;
      return Product
        .find()
        .skip((page - 1) * ITEMS_PER_PAGE) // skip the first items
        .limit(ITEMS_PER_PAGE) // limit the amount of items
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Boutique',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE) // Returns the smallest integer greater than or equal to its numeric argument.
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Produits',
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product
    .findById(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: 'Détails du produit',
        path: '/products'
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product
    .findById(productId)
    .then(product => req.user.addToCart(product))
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      res.render('shop/cart', {
        pageTitle: 'Panier',
        path: '/cart',
        products: user.cart.items
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .deleteCartItem(productId)
    .then(result => res.redirect('/cart'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => { // map to match to the order schema
        return {
          product: { ...i.productId._doc },
          quantity: i.quantity
        }
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products
      });
      order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getOrders = (req, res, next) => {
  Order
    .find({ "user.userId": req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Mes Commandes',
        path: '/orders',
        orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Total',
    path: '/checkout'
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order
    .findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('Pas de commande trouvée'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Utilisateur non autorisé'));
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);
      let totalPrice = 0;

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(18).text(`Commande n° ${order._id} -  Facture :`, { underline: true });
      pdfDoc.fontSize(14).text('---------------------------------------------------------------------');
      order.products.forEach(p => {
        totalPrice += p.product.price * p.quantity;
        pdfDoc.text(`${p.product.title} - ${p.quantity} x ${p.product.price} €  =  ${p.product.price * p.quantity}`);
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(18).text(`Total : ${totalPrice.toFixed(2)} €`)

      pdfDoc.end();
    })
    .catch(err => next(err));
};