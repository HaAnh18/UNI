const express = require('express');
const router = express.Router();
const customer = require('../controllers/customer');

router.get('/homepage', customer.getHomepage);

router.get('/cart', customer.getCart);

router.get('/checkout', customer.getCheckout);

router.get('/contact', customer.getContact);

router.get('/product', customer.getProduct);

router.get('/signin', customer.getSignin);

router.get('/signup', customer.getSignup);

router.get('/shop', customer.getShop);

router.get('/profile', customer.customerProfile);

router.get('/orderhistory', customer.getOrderHistory);

router.get('/changepassword', customer.getChangePassword);

module.exports = router;