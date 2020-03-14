const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find() 
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  console.log('llega');
  req.user
    .populate('cart.items.productId') //this is fetching the entire product from the user cart
    .execPopulate()   //this is going to execute the populate and returns a promise
    .then(user => {
      
      const products = user.cart.items;
      console.log(products);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
    return req.user.addToCart(product);
  }).then(result => {
      console.log(result);
      res.redirect('/cart');
  })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
    const products = user.cart.items;
    console.log(user.cart.items);
    const producopy =  user.cart.items.map(i => {  //here I'm tranforming the object to the correct structure in the cart
      return { 
        quantity: i.quantity, product: { ...i.productId._doc }
      }
    }); //with _doc I'm pulling out all the data from the object and with the spread operator I'm assinging it to the new object

    console.log(products);
    console.log('producopy ',producopy);
    debugger;
    const order = new Order({
      user: {
        name: req.user.mane,
        userId: req.user
      },
      products: user.cart.items.map(i => {  //here I'm tranforming the object to the correct structure in the cart
        return { quantity: i.quantity, productData: { ...i.productId._doc }}; //with _doc I'm pulling out all the data from the object and with the spread operator I'm assinging it to the new object
      })
    });
    order.save();
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(result => {
    console.log(result);
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
};


exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id}).then(orders => {
      console.log('orders ', orders);
      
      res.render('shop/orders', {
        path: '/orders',    
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
