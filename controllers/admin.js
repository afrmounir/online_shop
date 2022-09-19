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
  const product = new Product(title, price, description, imageURL);

  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const productId = req.params.productId;
//   req.user
//     .getProducts({ where: { id: productId } })
//     .then(products => {
//       const product = products[0]; // we get back a array even its a single product
//       if (!product) {
//         return res.redirect('/');
//       }
//       res.render('admin/edit-product', {
//         pageTitle: 'Éditer Produit',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//   const { title, imageURL, price, description, productId } = req.body; // updated values
//   Product
//     .findByPk(productId)
//     .then(product => {
//       product.title = title;
//       product.imageURL = imageURL;
//       product.price = price;
//       product.description = description;
//       return product.save();
//     })
//     .then(result => {
//       console.log('UPDATED PRODUCT');
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const productId = req.body.productId;
//   Product
//     .findByPk(productId)
//     .then(product => {
//       return product.destroy();
//     })
//     .then(result => {
//       console.log('DELETED PRODUCT');
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };

// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts()
//     .then(products => {
//       res.render('admin/products', {
//         prods: products,
//         pageTitle: 'Produits (Admin)',
//         path: '/admin/products'
//       });
//     })
//     .catch(err => console.log(err));
// };