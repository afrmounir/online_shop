const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../utilities/database');

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
});

module.exports = Order;