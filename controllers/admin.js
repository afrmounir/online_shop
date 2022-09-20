const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Ajouter Produit',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageURL, price, description } = req.body;
  const product = new Product(title, price, description, imageURL, null, req.user._id);

  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
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
        product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageURL, price, description, productId } = req.body; // updated values
  const product = new Product(title, price, description, imageURL, productId);

  product
    .save()
    .then(result => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product
    .deleteById(productId)
    .then(() => {
      console.log('DELETED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product
    .fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Produits (Admin)',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};