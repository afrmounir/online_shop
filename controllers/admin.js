const fileHelper = require('../utilities/file');

const { validationResult } = require('express-validator');

const Product = require('../models/product');
const product = require('../models/product');

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
  const { title, price, description } = req.body;
  const image = req.file;
  if (!image) {
    return res
      .status(422)
      .render('admin/edit-product', {
        pageTitle: 'Ajouter Produit',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        product: req.body,
        errorMessage: 'Le fichier n\'est pas une image valide.',
        validationErrors: []
      });
  }

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

  const imageURL = image.path;
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
  const { title, price, description, productId } = req.body;
  const image = req.file;

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
          title,
          price,
          description,
          _id: productId
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
  }

  Product
    .findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }

      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        fileHelper.deleteFile(product.imageURL);
        product.imageURL = image.path;
      }

      return product
        .save()
        .then(() => {
          console.log('UPDATED PRODUCT');
          res.redirect('/admin/products');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// exports.postDeleteProduct = (req, res, next) => {
//   const productId = req.body.productId;
//   Product
//     .findById(productId)
//     .then(product => {
//       if (!product) {
//         return next(new Error('Produit non trouvé'));
//       }
//       if (product.userId.toString() === req.user._id.toString()) {
//         fileHelper.deleteFile(product.imageURL);
//       }
//       return Product.deleteOne({ _id: productId, userId: req.user._id });
//     })
//     .then(() => {
//       res.redirect('/admin/products');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product
    .findOneAndDelete({ _id: productId, userId: req.user._id })
    .then(product => {
      if (!product) {
        return next(new Error('Produit non trouvé'));
      }
      fileHelper.deleteFile(product.imageURL);
    })
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