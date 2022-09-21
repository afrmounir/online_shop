const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//   User
//     .findById('6329c0b6b7939ba30474d19a')
//     .then(user => {
//       req.user = new User(user.username, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://user815:9TMiDci0cy0Pd92m@cluster0.ns3cqzi.mongodb.net/shop?retryWrites=true&w=majority')
  .then(() => app.listen(3000))
  .catch(err => console.log(err));
