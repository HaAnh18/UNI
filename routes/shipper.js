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

const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middlewares/auth-shipper');
const shipper = require('../controllers/shipper');

// Route to get signup
router.get("/signup", shipper.getSignup);

// Route to post signup
router.post('/signup', shipper.handleFileUpload, shipper.signup);

// Route to get signin
router.get("/signin", shipper.getSignin);

// Route to post signin
router.post('/signin', shipper.signin);

// Route to logout
router.get('/logout', shipper.logout);

// router.get('/getme', isAuthenticated, shipper.shipperProfile);

// Route to get dashboard
router.get("/dashboard", isAuthenticated, shipper.getDashboard);

// Route to get order detail
router.get("/order/:id", isAuthenticated, shipper.getOrder);

// Route to get profile
router.get("/editprofile", isAuthenticated, shipper.getEditProfile);

// Rout to edit profile
router.post('/editprofile', isAuthenticated, shipper.handleFileUpload, shipper.editProfile);

// Route to change order status to completed
router.get("/delivered/:id", isAuthenticated, shipper.deliveredOrder);

// Route to change order status to cancelled
router.get("/cancelled/:id", isAuthenticated, shipper.cancelledOrder);

// Route to change password
router.post('/changepassword', isAuthenticated, shipper.changePassword);

module.exports = router;