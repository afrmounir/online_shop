const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Ajouter Produit',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageURL, price, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render('admin/edit-product', {
        pageTitle: 'Ajouter Produit',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        product: req.body,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
  }

  const product = new Product({ title, imageURL, price, description, userId: req.user }); // mongoose pick the id himself from the entire object

  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      //   return res
      //     .status(500)
      //     .render('admin/edit-product', {
      //       pageTitle: 'Ajouter Produit',
      //       path: '/admin/add-product',
      //       editing: false,
      //       hasError: true,
      //       product: req.body,
      //       errorMessage: 'Erreur base de données, merci de réessayer ultérieurement',
      //       validationErrors: []
      //     });
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product
    .findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Éditer Produit',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render('admin/edit-product', {
        pageTitle: 'Éditer Produit',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        product: {
          title: req.body.title,
          imageURL: req.body.imageURL,
          price: req.body.price,
          description: req.body.description,
          _id: productId
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
  }

  Product
    .updateOne({ _id: productId, userId: req.user._id.toString() }, req.body) //getEditProduct provide product data with the same field name in req.body
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product
    .deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product
    .find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Produits (Admin)',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};