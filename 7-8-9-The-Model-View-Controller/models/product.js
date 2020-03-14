const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const Cart = require('./cart');

const products = [];
const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
  const p = path.join(rootDir, 'data', 'products.json');
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProduct = [...products];
        updatedProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProduct), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        //atention: If I don't use array function, I can't access to the class context with this
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      //here I'm filtering all the products that not match with the ine I'm deleting
      //so I can get the rest of the products left
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(p => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  //the statics means that I can invoke the method to the class and not to the instance of the class
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
