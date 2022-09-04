const path = require('path');

const express = require('express');

const rootDir = require('../utilities/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', {
    prods: products,
    pageTitle: 'Boutique',
    path: '/'
  });
});

module.exports = router;