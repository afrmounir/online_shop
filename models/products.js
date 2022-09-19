const getDb = require('../utilities/database').getDb;

class Product {
  constructor(title, price, description, imageURL) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
  }

  save() {
    const db = getDb();
    db.collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));
  }
}

module.exports = Product;

// const db = require('../utilities/database');

// const Cart = require('./cart');

// module.exports = class Product {
//   constructor(title, imageURL, price, description, id) {
//     this.title = title;
//     this.imageURL = imageURL;
//     this.price = price;
//     this.description = description;
//     this.id = id;
//   }

//   save() {
//     return db.execute('INSERT INTO products (title, price, imageURL, description) VALUES (?, ?, ?, ?)',
//       [this.title, this.price, this.imageURL, this.description]
//     );
//   }

//   static deleteById(id) {

//   }

//   static fetchAll() {
//     return db.execute('SELECT * FROM products');
//   }

//   static findById(id) {
//     return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//   }
// }