const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

//And here I'm importing the middleware so I can add it as a handler to the
//requeested endpoint
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//THE REQUESTS TRAVELS FROM LEFT TO RIGHT

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
