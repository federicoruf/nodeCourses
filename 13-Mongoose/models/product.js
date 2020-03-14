const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//this is removing some flexibility to the product object
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',   //here is specifying which other model references this element userId
    required: true
  }
});
//mongoose will translate the name of the schema and it 
//interpretate like this: products (lowercase and plural)
module.exports = mongoose.model('Product', productSchema);
/*
const mongodb = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl; 
    //if I pass an undefined id, it'll also generate an id
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      //$set is an operation from mongo which updated the hole entity
      dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db.collection('products').insertOne(this);//this insert the object passed as parameter
    }
    //Here I'm connecting to the collection products
    //if not exist, it'll be created
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    //find returns a cursor which allows me to analize the collection
    //In the other hand, if I get the hole bunch of objects it could be
    //really difficult to handle such amount of data at once
    return db.collection('products')
      .find()
      .toArray()
      .then()
      .catch(err => {
        console.log(err);
      });
  }
  static findById(prodId){
    const db = getDb();
    //next return the next item in the cursor 
    //the id it's not just a random string, it's an objectId, so I need to transform the id comming from the view to an objectId
    //ObjectId is a kinfd of object added by mongodb 
    return db.collection('products').find({_id: new mongodb.ObjectId(prodId) }).next().then( product => {
      console.log(product);
      return product;
    })
     .catch(err => {
      console.log(err);
    });
  }

  static deleteById(prodId){
    const db = getDb();
    return db.collection('products')
      .deleteOne({_id: new mongodb.ObjectId(prodId)})
      .then(result => console.log('Deleted'))
      .catch(err => console.log(err));

  }
}

module.exports = Product;
*/