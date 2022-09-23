const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://user815:9TMiDci0cy0Pd92m@cluster0.ns3cqzi.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new mongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'shouldbealongstringvalue', resave: false, saveUninitialized: false, store: store }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User
      .findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'User1',
            email: 'user1@icloud.com',
            cart: {
              items: []
            }
          });
          user.save();
        }
      });
    app.listen(3000)
  })
  .catch(err => console.log(err));
