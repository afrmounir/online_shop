const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utilities/database');

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }  
});

module.exports = Cart;