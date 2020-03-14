const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://federico:yQEsRcMSOQVKp5gu@cluster0-88ugq.mongodb.net/shop?retryWrites=true&w=majority';
const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'my secret', //the secret is the base code string to enconde the variables of the session
    reserve: false,
    saveUninitialized: false,
    store: store //here is settting the source where the sessions will be saved
  })
);


//this is a middleware(like a filter in Java) that catch every incoming request to the server,
//makes something, and then continues
app.use((req, res, next) => {
  if (!req.session.user_id) {
    next();
  } else {
    User.findById(req.session.user_id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
console.log('adasdasd');
app.listen(3001);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
