const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'online_shop',
  password: 'OnlineShop'
});

module.exports = pool.promise();