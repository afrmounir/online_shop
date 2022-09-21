const mongodb = require('mongodb');
const getDb = require('../utilities/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(p => p.productId.toString() === product._id.toString()); // toString => _id is retrieved from db, _id is treated as a string in js but it's not of type string so === will be false.
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity += this.cart.items[cartProductIndex].quantity;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() { // return an array of objects => {...p, quantity}
    const db = getDb();
    const productsId = this.cart.items.map(i => { // return an array with all the products id in the cart
      return i.productId
    });

    return db //this part retrieve the products by id in the products collection and their quantity in the cart collection
      .collection('products')
      .find({ _id: { $in: productsId } }).toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString() // toString => _id is retrieved from db, _id is treated as a string in js but it's not of type string so === will be false.
            }).quantity
          };
        });
      })
      .catch(err => console.log(err));
  }

  deleteCartItem(productId) {
    const updatedCartItems = this.cart.items.filter(i => i.productId.toString() !== productId.toString());
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart() // retrieve products and their quantity from the cart
      .then(products => {
        const order = { // merge cart and user informations before sending them to db 
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            username: this.username
          }
        };
        return db
          .collection('orders')
          .insertOne(order)
      })
      .then(() => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      })
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new mongodb.ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
  }
}

module.exports = User;