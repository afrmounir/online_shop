const path = require('path');

const express = require('express');

const errorController = require('./controllers/error');
const sequelize = require('./utilities/database')
const Product = require('./models/products');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE'
});
User.hasMany(Product);

sequelize
  .sync({ force: true })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });