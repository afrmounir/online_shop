const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utilities/database');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: DataTypes.INTEGER
});

module.exports = OrderItem;