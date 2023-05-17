const express = require('express');
const router = express.Router();
const {signup, signin, logout, getMe, handleFileUpload, shipperProfile} = require("../controllers/shipper");
const {isAuthenticated} = require('../middlewares/auth-shipper');
const shipper = require('../controllers/shipper');

// router.get('/signup', (req,res)=>{
//   res.render("signup-shipper");
// })

router.get("/signup", shipper.getSignup);

router.post('/signup', handleFileUpload, shipper.signup);

router.get("/signin", shipper.getSignin);

router.post('/signin', shipper.signin);

router.get('/logout', logout);

// router.get('/signin', (req,res) => {
//   res.render('login-shipper');
// })

 router.get('/getme', isAuthenticated, shipperProfile);

// router.get('/customer',verifyToken, getMe);
// router.get('/customer', verifyToken, getMe);
// Example usage:
// router.get('/customer', verifyToken, getMe);

//frontend
router.get("/dashboard", isAuthenticated, shipper.getDashboard);


router.get("/order", isAuthenticated, shipper.getOrder);

router.get("/editprofile", isAuthenticated, shipper.getEditProfile);

module.exports = router;