const express = require('express');
const router = express.Router();
const {signup, signin, logout, getMe, handleFileUpload, showCart, customerProfile, addToCart, productProfile, productVendor} = require("../controllers/customer");
const {isAuthenticated} = require('../middlewares/auth');
const {showProduct} = require('../controllers/vendor')
const Vendor = require("../models/vendor");

router.get('/signup', (req,res)=>{
  res.render("signup");
})

router.post('/signup', handleFileUpload, signup);

router.post('/signin', signin);

router.get('/logout', logout);

router.get('/signin', (req,res) => {
  res.render('login');
})
 router.get('/getme', isAuthenticated, customerProfile);

// router.get('/customer',verifyToken, getMe);
// router.get('/customer', verifyToken, getMe);
// Example usage:
// router.get('/customer', verifyToken, getMe);

router.get('/products', showProduct);

router.get('/product/:id', productProfile);

router.get('/vendor/:id', productVendor);

router.get('/product/:id/addtocart', isAuthenticated, addToCart);

// router.get('/cart', isAuthenticated, (req,res) => {
//   res.render('')
// })

router.get('/cart', isAuthenticated, showCart);


//frontend
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