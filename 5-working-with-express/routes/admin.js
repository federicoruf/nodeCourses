const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const router = express.Router();

//this file will be analized from top to bottom looking for the requested endpoint
router.get('/add-product', (req, res, next) => {
  console.log('middleware del product page');
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  /*
  res.send(
    '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
  );
  */
});

router.post('/add-product', (req, res, next) => {
  console.log('llama al post');
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
