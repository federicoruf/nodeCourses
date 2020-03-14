const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//this will execute for the first time after
//the connecing is configured (after the app.listen(3000))
//so it's secure to find the id=1
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      //now each request will have the user in it
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//here I'm specifing the relations between the models

//I'm specifiing to delete the product once the user is deleted
Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
//through indicates where the association will be stored
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//this is generating all the schemas in the database
//creating the tablas and relations
//it's not going to override the existing table if it already exist
//with {force: true}, is going to delete all the tables, TO USE ONLY EN DEV MODE
sequelize
  .sync()
  // .sync({ force: true })
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com.ar' });
    }
    return user;
  })
  .then(user => {
    //console.log(user);
    return user.createCart();
  })
  .then(cart => {
    console.log(cart);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
