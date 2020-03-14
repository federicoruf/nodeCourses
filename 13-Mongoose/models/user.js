const mongoose = require('mongoose') ;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [ { 
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  },
  orders: [{
    order: [{ 
        item: {
          productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true }
        } 
      }
    ]
  }]
});

//I'm adding this method to the user object 
userSchema.methods.addToCart = function(product){

  const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuanity = 1;
    //copy the original array con products
    const updatedCartsItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuanity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartsItems[cartProductIndex].quantity = newQuanity;
    } else {
      updatedCartsItems.push({
        productId: product._id, 
        quantity: 1
      });
    }

    const updatedCart = {
      items: updatedCartsItems 
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
  console.log('productId ', productId);
  const updatedCartItems = this.cart.items.filter(item => {
    console.log('item.productId.toString() ', item.productId.toString());
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.addOrder = function() {
  const items = this.cart.items;
  console.log('items: ', items);
  const orders = this.orders;
  console.log('orders: ', orders);
  this.orders = [...orders, items];
  //const order = this.cart;
  //this.orders.push({items});
  this.cart = [];
  return this.save();
}

userSchema.methods.clearCart = function(){
  this.cart = {items:[]};
  return this.save();
}


module.exports = mongoose.model('User', userSchema);
/*
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    db.collection('users')
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  addOrder() {
    const db = getDb();
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      };
      return db.collection('orders').insertOne(order);
    })
    .then(result => {
      this.cart = {ítems: []};
      return db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(this._id)},
          { $set: { cart: {items: [] } } }
        );
    });
  }

  removeFromCart(productId){
    const updatedCartsItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id)},
        { $set: { cart: { items: updatedCartsItems } } }
      );
  }

  static findById(userId){
    const db = getDb();
    return db.collection('users')
      .find({_id: new mongodb.ObjectId(userId) })
      .next()  //next makes to return the first element
      .then( user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCart(){
    const db = getDb();
    //here I get all the products ids stored in the collection of items inside the cart
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db
      .collection('products')
      .find({_id: {$in: productIds}})
      .toArray()
      .then(products => {
        return products.map(p => {
          //here I return the complete object but also I add a new property that is the quantity, extracted from the cart.items
          return {...p, quantity: this.cart.items.find(i => { return i.productId.toString() === p._id.toString()}).quantity};
        });
      });
  }

  getOrders() {
    const db = getDb();
    //this will compare the user embedded in the order item 
    return db.collection('orders').find({ 'user._id': new ObjectId(this._id)}).toArray();
  }
}

module.exports = User;
*/