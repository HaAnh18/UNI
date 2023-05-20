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

router.get("/signup", shipper.getSignup);

router.post('/signup', shipper.handleFileUpload, shipper.signup);

router.get("/signin", shipper.getSignin);

router.post('/signin', shipper.signin);

router.get('/logout', shipper.logout);

// router.get('/signin', (req,res) => {
//   res.render('login-shipper');
// })

 router.get('/getme', isAuthenticated, shipper.shipperProfile);

// router.get('/customer',verifyToken, getMe);
// router.get('/customer', verifyToken, getMe);
// Example usage:
// router.get('/customer', verifyToken, getMe);

//frontend
router.get("/dashboard", isAuthenticated, shipper.getDashboard);

router.get("/order/:id", isAuthenticated, shipper.getOrder);

router.get("/editprofile", isAuthenticated, shipper.getEditProfile);

router.post('/editprofile', isAuthenticated, shipper.handleFileUpload, shipper.editProfile);

router.get("/delivered/:id", isAuthenticated, shipper.deliveredOrder);

router.get("/cancelled/:id", isAuthenticated, shipper.cancelledOrder);

router.post('/changepassword', isAuthenticated, shipper.changePassword);

module.exports = router;