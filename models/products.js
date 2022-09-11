const db = require('../utilities/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(title, imageURL, price, description, id) {
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
    this.id = id;
  }

  save() {
    
  }

  static deleteById(id) {
    
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    
  }
}