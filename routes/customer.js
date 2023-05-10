const express = require('express');
const router = express.Router();
const {signup, signin, logout, getMe, handleFileUpload, customerProfile} = require("../controllers/customer");
const {isAuthenticated} = require('../middlewares/auth');

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

module.exports = router;