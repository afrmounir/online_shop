const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utilities/database');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: DataTypes.INTEGER
});

module.exports = CartItem;