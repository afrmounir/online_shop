const mongodb = require('mongodb');
const getDb = require('../utilities/database').getDb;

class Product {
  constructor(title, price, description, imageURL, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = new mongodb.ObjectId(id); // mongodb store id in a 12 byte object (BSON)
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db
        .collection('products')
        .insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));

  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products').find().toArray()
      .then(products => products)
      .catch(err => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection('products').find({ _id: new mongodb.ObjectId(productId) }).next()
      .then(product => product)
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