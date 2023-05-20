/*--------------------------------------------------------------------------------------------------------------------------------------------------
// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Tom's Prodigies V2
// ID: 
// Nguyen Tran Ha Anh: s3938490
// Dang Kim Quang Minh: s3938024
// Nguyen Gia Bao: s3938143
// Hoang Tuan Minh: s3924716
// Vu Loc: s3891483
// Acknowledgement: 
Acknowledgement: 
//how to make user profile dropdown
https://www.youtube.com/watch?v=ybXulmeilFM
https://codepen.io/cristinaconacel/pen/XymvvO
//how to make a profile page
https://www.bootdey.com/snippets/view/bs5-edit-profile-account-details
//login and signup error message
https://stackoverflow.com/questions/71409981/how-to-hide-error-message-once-the-user-starts-writing-in-the-input-field
//how to create faqs page
https://www.bootdey.com/snippets/view/paq-page
//how to create order status
https://mdbootstrap.com/docs/standard/extended/order-details/#
//login and sign up page
https://www.youtube.com/watch?v=Qv5vdKLKpQk
----------------------------------------------------------------------------------------------------------------------------------------------------*/
const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middlewares/auth');
const customer = require("../controllers/customer");

// Rote to get signup
router.get('/signup', customer.getSignup);

// Route to post signup
router.post('/signup', customer.handleFileUpload, customer.signup);

// Route to get signin
router.get('/signin', customer.getSignin);

// Route to post signin
router.post('/signin', customer.signin);

// Route to logout
router.get('/logout', customer.logout);

// router.get('/getme', isAuthenticated, customer.customerProfile);

// Route to get homepgae
router.get('/homepage', customer.showProduct);

// Route to get product's information
router.get('/product/:id', customer.productProfile);

// Route to get vendor's information
router.get('/vendor/:id', customer.productVendor);

// Route to add product to customer's cart
router.get('/product/:id/addtocart', isAuthenticated, customer.addToCart);

// Route to delete quantity in customer's cart
router.get('/product/:id/deleteproductquantity', isAuthenticated, customer.deleteProductQuantity);

// Route to delete product in customer's cart
router.get('/delete/:id', isAuthenticated, customer.deleteProduct);

// Rout to get the customer's cart
router.get('/cart', isAuthenticated, customer.showCart);

// Route to create order for customer
router.get('/order', isAuthenticated, customer.createOrder);

// Route to checkout customer's order
router.get('/checkout', isAuthenticated, customer.getCheckout);

// Route to create order for customer
router.get('/createorder', isAuthenticated, customer.createOrder);

// Rout to get the contact page
router.get('/contact', customer.getContact);

// Rout to get order history
router.get('/orderhistory', isAuthenticated, customer.getOrderHistory);

// Rout to edit customer's profile
router.post('/editprofile', isAuthenticated, customer.handleFileUpload, customer.editProfile)

// Route to get change password page
router.get('/changepassword', isAuthenticated, customer.getChangePassword);

// Route to get customer's profile
router.get('/profile', isAuthenticated, customer.getCustomerProfile);

//about us
router.get('/about', customer.getCustomerAboutUs);

//contact
router.get('/contact', customer.getCustomerContact);

//FAQs
router.get('/faq', customer.getCustomerFaq);

//shop
router.get('/shop', customer.getShop);

//Order details
router.get('/orderstatus/:id', isAuthenticated, customer.getOrder);

//Security
router.get('/security', isAuthenticated, customer.getCustomerSecurity);

// Change password
router.post('/changepassword', isAuthenticated, customer.changePassword);

//Categories
router.get('/category/clothing', customer.getClothing);

// Route to get electronic product
router.get('/category/electronic', customer.getElectronic);

// Route to get book product
router.get('/category/book', customer.getBook);

// Rout to get search product
router.get('/homepage/search/', customer.searchProduct);

// Route to filter product by price
router.get('/products/:min-:max', customer.filterByPrice);

module.exports = router;