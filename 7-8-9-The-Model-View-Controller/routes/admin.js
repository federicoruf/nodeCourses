const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

//the routes here is no need to indicate the /admin because in the app.js file I'm
//already indicating the /admin
//this is what I'm saying: app.use('/admin', adminRoutes);

// /admin/add-product => GET
//I'm making reference to the function getAddProduct, but I don't pass the (), because
//  I don't to execute it right now
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
