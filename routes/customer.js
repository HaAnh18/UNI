const express = require('express');
const router = express.Router();
const {signup, signin, logout, getMe, handleFileUpload, showCart, customerProfile, addToCart, productProfile, productVendor} = require("../controllers/customer");
const {isAuthenticated} = require('../middlewares/auth');
const {showProduct} = require('../controllers/vendor')
const customer = require("../controllers/customer");

router.get('/signup', customer.getSignup);

router.post('/signup', customer.handleFileUpload, customer.signup);

router.get('/signin', customer.getSignin);

router.post('/signin', customer.signin);

router.get('/logout', customer.logout);

router.get('/getme', isAuthenticated, customer.customerProfile);

router.get('/homepage', customer.showProduct);

router.get('/product/:id', productProfile);

router.get('/vendor/:id', customer.productVendor);

router.get('/product/:id/addtocart', isAuthenticated, customer.addToCart);

router.get('/product/:id/deleteproductquantity', isAuthenticated, customer.deleteProductQuantity);

router.get('/delete/:id', isAuthenticated, customer.deleteProduct);

router.get('/cart', isAuthenticated, customer.showCart);



router.get('/order', isAuthenticated, customer.createOrder);

router.get('/checkout', isAuthenticated, customer.getCheckout);

router.get('/createorder', isAuthenticated, customer.createOrder);

router.get('/contact', customer.getContact);

// router.get('/product', customer.getProduct);


// router.get('/profile', customer.customerProfile);

router.get('/orderhistory', isAuthenticated, customer.getOrderHistory);

router.post('/editprofile', isAuthenticated, customer.handleFileUpload, customer.editProfile)

router.get('/changepassword', isAuthenticated, customer.getChangePassword);

router.get('/profile', isAuthenticated, customer.getCustomerProfile);


/*=========================================================Customer Route================================================================*/
//about us
router.get('/about', customer.getCustomerAboutUs);

//contact
router.get('/contact', customer.getCustomerContact);

//FAQs
router.get('/faq', customer.getCustomerFaq);

//shop
router.get('/shop', customer.getShop);

//Order details
router.get('/orderstatus/:id', isAuthenticated, customer.getOrderStatus);

//Security
router.get('/security', isAuthenticated, customer.getCustomerSecurity);

//Change password
router.post('/changepassword', isAuthenticated, customer.changePassword);

//Categories
router.get('/category/clothing', customer.getClothing);

router.get('/category/electronic', customer.getElectronic);

router.get('/category/book', customer.getBook);

router.get('/homepage/search/', customer.searchProduct);

router.get('/products/:min-:max', customer.filterByPrice);
/*=======================================================================================================================================*/
module.exports = router;