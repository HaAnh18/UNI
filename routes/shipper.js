const express = require('express');
const router = express.Router();
const {signup, signin, logout, getMe, handleFileUpload, shipperProfile} = require("../controllers/shipper");
const {isAuthenticated} = require('../middlewares/auth-shipper');

router.get('/signup', (req,res)=>{
  res.render("signup-shipper");
})

router.post('/signup', handleFileUpload, signup);

router.post('/signin', signin);

router.get('/logout', logout);

router.get('/signin', (req,res) => {
  res.render('login-shipper');
})
 router.get('/getme', isAuthenticated, shipperProfile);

// router.get('/customer',verifyToken, getMe);
// router.get('/customer', verifyToken, getMe);
// Example usage:
// router.get('/customer', verifyToken, getMe);

module.exports = router;