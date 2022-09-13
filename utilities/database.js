const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('online_shop', 'root', 'OnlineShop', {
  dialect: 'mysql'
});

module.exports = sequelize;