const express = require('express');
const router = express.Router();
const {signup, signin, logout, getMe, handleFileUpload, showCart, customerProfile, addToCart, productProfile, productVendor} = require("../controllers/customer");
const {isAuthenticated} = require('../middlewares/auth');
const {showProduct} = require('../controllers/vendor')
const customer = require("../controllers/customer");

router.get('/signup', customer.getSignup);

router.post('/signup', customer.handleFileUpload, signup);

router.get('/signin', customer.getSignin);

router.post('/signin', customer.signin);

// router.get('/homepage', customer.getHomepage);

router.get('/logout', logout);

// router.get('/signin', (req,res) => {
//   res.render('login');
// })
 router.get('/getme', isAuthenticated, customerProfile);

// router.get('/customer',verifyToken, getMe);
// router.get('/customer', verifyToken, getMe);
// Example usage:
// router.get('/customer', verifyToken, getMe);

router.get('/homepage', customer.showProduct);

router.get('/product/:id', productProfile);

router.get('/vendor/:id', customer.productVendor);

router.get('/product/:id/addtocart', isAuthenticated, addToCart);

// router.get('/cart', isAuthenticated, (req,res) => {
//   res.render('')
// })

router.get('/cart', isAuthenticated, showCart);


//frontend


// router.get('/cart', customer.getCart);

router.get('/checkout', isAuthenticated, customer.createOrder);

router.get('/contact', customer.getContact);

router.get('/product', customer.getProduct);



router.get('/shop', customer.getShop);

// router.get('/profile', customer.customerProfile);

router.get('/orderhistory', customer.getOrderHistory);

router.get('/changepassword', customer.getChangePassword);

/*=========================================================Customer Route================================================================*/
//about us
router.get('/about', customer.getCustomerAboutUs);
//contact
router.get('/contact', customer.getCustomerContact);
//FAQs
router.get('/faq', customer.getCustomerFaq);
//login & signup
router.get('/login', customer.getCustomerLogin);
//homepage (index)
//already route above
//shop
router.get('/shop', customer.getCustomerShop);
//shop detail
//already route above
//cart
router.get('/cart', customer.getCustomerCart);
//checkout
router.get('/checkout', customer.getCustomerCheckout);
//profile
router.get('/profile', isAuthenticated, customer.getCustomerProfile);
//order
router.get('/order', customer.getCustomerOrder);
//security
router.get('/security', customer.getCustomerSecurity);
/*=======================================================================================================================================*/
module.exports = router;