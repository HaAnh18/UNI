const express = require('express');
const router = express.Router();
const {signup, signin, logout, getMe, handleFileUpload, vendorProfile, addProduct, showProduct} = require("../controllers/vendor");
const {isAuthenticated} = require('../middlewares/auth-vendor');

router.get('/signup', (req,res)=>{
  res.render("signup-vendor");
})

router.post('/signup', handleFileUpload, signup);

router.post('/signin', signin);

router.get('/logout', logout);

router.get('/signin', (req,res) => {
  res.render('login-vendor');
})
router.get('/getme', isAuthenticated, vendorProfile);

router.get('/addproduct', isAuthenticated, (req,res) => {
  res.render('add-product');
});

router.post('/addproduct', isAuthenticated, handleFileUpload, addProduct);

// router.get('/customer',verifyToken, getMe);
// router.get('/customer', verifyToken, getMe);
// Example usage:
// router.get('/customer', verifyToken, getMe);
router.get('/products', isAuthenticated, showProduct);

module.exports = router;