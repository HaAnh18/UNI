const express = require('express');
const router = express.Router();
const {signup, signin, logout, getMe, handleFileUpload, vendorProfile, addProduct} = require("../controllers/vendor");
const {isAuthenticated} = require('../middlewares/auth-vendor');
const vendor = require('../controllers/vendor');

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

//frontend
router.get("/", vendor.showDashboard);

router.get("/products", vendor.showProduct);

router.get("/login", vendor.getLogin);

router.get("/signup", vendor.getSignup);

router.get("/addproduct", vendor.getAddProduct);

router.get("/profile", vendor.vendorProfile);

router.get("/termService", vendor.termService);

router.get("/pendingOrder", vendor.pendingOrder);

router.get("/activeOrder", vendor.activeOrder);

router.get("/cancelledOrder", vendor.cancelledOrder);


module.exports = router;