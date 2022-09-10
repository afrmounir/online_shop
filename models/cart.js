const fs = require('fs');
const path = require('path')

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch previous cart
    fs.readFile(p, (err, data) => {
      let cart = {
        products: [],
        totalPrice: 0
      };

      if (!err) {
        cart = JSON.parse(data);
      }
      // Analyze cart => find existing product
      const existingProductIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      // Add new product || increase qty
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty++;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          qty: 1
        };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += +productPrice;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });

    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, data) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(data) };
      const product = updatedCart.products.find(product => product.id === id);
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(product => product.id !== id);
      updatedCart.totalPrice -= (productPrice * productQty);

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, data) => {
      const cart = JSON.parse(data);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
}